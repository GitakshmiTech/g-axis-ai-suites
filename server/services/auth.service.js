const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');

// Models
const User = require('../models/user.model');
const Tenant = require('../models/tenant.model');
const AuditLog = require('../models/auditLog.model');
const PasswordReset = require('../models/passwordReset.model');

// ==================================================================================================================
//    Login User Service
// ==================================================================================================================
const loginUser = async (email, password, rememberMe, reqInfo) => {
// ==================================================================================================================
//    1. Find user by email (active check as well)
// ==================================================================================================================
    const user = await User.findByEmail(email);

    if (!user) {
        return { error: 'invalid_credentials', message: 'Invalid email or password.' };
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return { error: 'account_locked', message: 'Your account has been temporarily locked due to multiple failed login attempts.' };
    }

// ==================================================================================================================
//    2. Verify password
// ==================================================================================================================
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        // Increment failed attempts and potentially lock account
        const failedAttempts = user.failed_attempts + 1;

        if (failedAttempts >= 5) {
            // Lock for 15 minutes
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            await User.lockAccount(user.id, failedAttempts, lockUntil);
        } else {
            await User.incrementFailedAttempts(user.id, failedAttempts);
        }
        
        await AuditLog.createLog(user.id, user.tenant_id, 'LOGIN_FAILED', 'Failed login attempt', reqInfo);
        
        return { error: 'invalid_credentials', message: 'Invalid email or password.' };
    }

    // Reset failed attempts on successful password verification
    if (user.failed_attempts > 0 || user.locked_until !== null) {
        await User.resetFailedAttempts(user.id);
    }

// ==================================================================================================================
//    3. Check if user is active
// ==================================================================================================================
    if (user.status !== 'active') {
        return { error: 'inactive_user', message: 'Your account is inactive. Please contact your administrator.' };
    }

// ==================================================================================================================
//    4. Check tenant
// ==================================================================================================================
    const tenant = await Tenant.findById(user.tenant_id);

    if (!tenant) {
        return { error: 'invalid_credentials', message: 'Invalid email or password.' };
    }

    if (tenant.status !== 'active') {
        return { error: 'inactive_tenant', message: 'Your organization account is currently inactive. Please contact your administrator.' };
    }

// ==================================================================================================================
//    5. Check role/access
// ==================================================================================================================
    const roles = await User.getUserRoles(user.id);

    if (roles.length === 0) {
        return { error: 'no_access', message: 'You do not have access to this application.' };
    }

// ==================================================================================================================
//    6. Generate Token
// ==================================================================================================================
    const expiresIn = rememberMe ? '7d' : '24h';
    const payload = {
        userId: user.id,
        tenantId: user.tenant_id,
        roles
    };
    
    const accessToken = generateToken(payload, expiresIn);

// ==================================================================================================================
//    7. Audit log
// ==================================================================================================================
    await AuditLog.createLog(user.id, user.tenant_id, 'LOGIN_SUCCESS', 'Successful login', reqInfo);

    return {
        success: true,
        user: {
            id: user.id,
            email: user.email,
        },
        tenant: {
            id: tenant.id,
            name: tenant.name
        },
        roles,
        accessToken
    };
};

// ==================================================================================================================
//    Audit Logging Service
// ==================================================================================================================
const logAudit = async (userId, tenantId, action, details, reqInfo) => {
    await AuditLog.createLog(userId, tenantId, action, details, reqInfo);
};

// ==================================================================================================================
//    Request Password Reset Service (Forgot Password)
// ==================================================================================================================
const requestPasswordReset = async (email, reqInfo) => {
    // 1. Find user and check eligibility
    const user = await User.findByEmailWithTenantStatus(email);

    // If no user, or user inactive, or tenant inactive -> abort silently (enum protection)
    if (!user || user.status !== 'active' || user.tenant_status !== 'active') {
        await AuditLog.createLog(user ? user.id : null, user ? user.tenant_id : null, 'PASSWORD_RESET_FAILED', 'Account not found or ineligible', reqInfo);
        return { success: true }; // Generic response
    }

    // 2. Rate limiting check (e.g., max 1 request per 15 minutes)
    const recentRequestsCount = await PasswordReset.countRecentRequests(user.id);

    if (recentRequestsCount > 0) {
        await AuditLog.createLog(user.id, user.tenant_id, 'PASSWORD_RESET_REQUEST_RATE_LIMITED', 'Rate limit exceeded', reqInfo);
        return { error: 'rate_limited', message: 'Too many reset requests. Please try again later.' };
    }

    // 3. Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Configurable expiry, default 30 mins
    const expiryMinutes = parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 30;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // 4. Save token hash
    await PasswordReset.createResetToken(user.id, tokenHash, expiresAt);

    // 5. Send email
    const clientUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
    
    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>Hello,</p>
                <p>You requested a password reset. Click the link below to reset your password. This link is valid for ${expiryMinutes} minutes.</p>
                <p><a href="${resetLink}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
            `
        });
        
        await AuditLog.createLog(user.id, user.tenant_id, 'PASSWORD_RESET_REQUESTED', 'Password reset email sent', reqInfo);
    } catch (error) {
        console.error('Failed to send reset email:', error);
        await AuditLog.createLog(user.id, user.tenant_id, 'PASSWORD_RESET_EMAIL_FAILED', 'Failed to send reset email', reqInfo);
        // Do not throw, return generic success
    }

    return { success: true };
};

// ==================================================================================================================
//    Confirm Password Reset Service (Set New Password)
// ==================================================================================================================
const confirmPasswordReset = async (rawToken, newPassword, reqInfo) => {
    let connection;
    try {
        // Hash the incoming token
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        connection = await pool.getConnection();
        
        // Find the token
        const resetRecord = await PasswordReset.findByTokenHash(tokenHash, connection);

        if (!resetRecord) {
            if (connection) connection.release();
            // We don't have a user ID here, so audit log can't attach to a specific user easily without the token.
            await AuditLog.createLog(null, null, 'PASSWORD_RESET_FAILED', 'Invalid token provided', reqInfo);
            return { error: 'invalid_token', message: 'This password reset link is no longer valid. Please request a new reset link.' };
        }

        // Check if already used
        if (resetRecord.used_at !== null) {
            if (connection) connection.release();
            await AuditLog.createLog(resetRecord.user_id, null, 'PASSWORD_RESET_TOKEN_ALREADY_USED', 'Token already used', reqInfo);
            return { error: 'token_used', message: 'This password reset link is no longer valid. Please request a new reset link.' };
        }

        // Check if expired
        if (new Date() > new Date(resetRecord.expires_at)) {
            if (connection) connection.release();
            await AuditLog.createLog(resetRecord.user_id, null, 'PASSWORD_RESET_TOKEN_EXPIRED', 'Token expired', reqInfo);
            return { error: 'token_expired', message: 'This password reset link has expired. Please request a new reset link.' };
        }

        // Check user eligibility
        const user = await User.findByIdWithTenantStatus(resetRecord.user_id, connection);

        if (!user || user.status !== 'active' || user.tenant_status !== 'active') {
            if (connection) connection.release();
            await AuditLog.createLog(resetRecord.user_id, user ? user.tenant_id : null, 'PASSWORD_RESET_FAILED', 'User ineligible for reset', reqInfo);
            return { error: 'invalid_user', message: 'This password reset link is no longer valid. Please request a new reset link.' };
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Transaction
        await connection.beginTransaction();

        // Update user
        await User.updatePassword(user.id, newPasswordHash, connection);

        // Invalidate token
        await PasswordReset.markTokenAsUsed(resetRecord.id, connection);

        await connection.commit();
        connection.release();

        await AuditLog.createLog(user.id, user.tenant_id, 'PASSWORD_RESET_CONFIRMED', 'Password reset successfully', reqInfo);

        return { success: true };

    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error('Confirm Password Reset Error:', error);
        throw error; // Let controller handle 500
    }
};

// ==================================================================================================================
//    Get Google Account Chooser List Service (SSO)
// ==================================================================================================================
const getGoogleAccounts = async (reqInfo) => {
    try {
        // According to the prompt: "If Google SSO is not configured: Return SSO authentication is not configured for your organization."
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            await AuditLog.createLog(null, null, 'SSO_GOOGLE_AUTH_FAILED', 'SSO not configured', reqInfo);
            return { error: 'sso_not_configured', message: 'SSO authentication is not configured for your organization.' };
        }
        return { success: true, accounts: [] };

    } catch (error) {
        console.error('Get Google Accounts Service Error:', error);
        throw error;
    }
};

module.exports = {
    loginUser,
    requestPasswordReset,
    confirmPasswordReset,
    getGoogleAccounts
};
