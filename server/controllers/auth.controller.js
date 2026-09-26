const authService = require('../services/auth.service');

// ==================================================================================================================
//    Login API Controller
// ==================================================================================================================
const login = async (req, res) => {
    try {
        const { email, password, rememberMe = false } = req.body;

        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };

        const result = await authService.loginUser(email.trim(), password, rememberMe, reqInfo);

        if (result.error) {
            let statusCode = 401; // default to invalid credentials
            if (result.error === 'account_locked') statusCode = 423;
            else if (result.error === 'inactive_user' || result.error === 'inactive_tenant' || result.error === 'no_access') statusCode = 403;

            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                user: result.user,
                tenant: result.tenant,
                roles: result.roles,
                accessToken: result.accessToken
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Unable to sign in at the moment. Please try again later.' });
    }
};

// ==================================================================================================================
//    Request Password Reset API Controller (Forgot Password)
// ==================================================================================================================
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };

        const result = await authService.requestPasswordReset(email.trim(), reqInfo);

        if (result.error && result.error === 'rate_limited') {
            return res.status(429).json({ success: false, message: result.message });
        }

        // Generic response for account enumeration protection
        return res.status(200).json({
            success: true,
            message: 'If an eligible account exists, a password reset link has been sent to the registered email address.'
        });

    } catch (error) {
        console.error('Password Reset Request Error:', error);
        return res.status(500).json({ success: false, message: 'Unable to process your request at the moment. Please try again later.' });
    }
};

// ==================================================================================================================
//    Confirm Password Reset API Controller (Set New Password)
// ==================================================================================================================
const confirmPasswordReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };

        const result = await authService.confirmPasswordReset(token, newPassword, reqInfo);

        if (result.error) {
            let statusCode = 400; // generic validation error
            if (result.error === 'token_expired') {
                statusCode = 410; // Gone, or keep 400 as standard
            } else if (result.error === 'rate_limited') {
                statusCode = 429;
            }
            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Your password has been reset successfully.'
        });

    } catch (error) {
        console.error('Password Reset Confirm Error:', error);
        return res.status(500).json({ success: false, message: 'Unable to process your request at the moment. Please try again later.' });
    }
};

// ==================================================================================================================
//    Get Google Account Chooser List API Controller (SSO)
// ==================================================================================================================
const getGoogleAccounts = async (req, res) => {
    try {
        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };

        const result = await authService.getGoogleAccounts(reqInfo);

        if (result.error) {
            let statusCode = 400; 
            if (result.error === 'sso_not_configured') statusCode = 403;
            else if (result.error === 'provider_unavailable') statusCode = 503;
            else if (result.error === 'invalid_auth') statusCode = 401;
            else if (result.error === 'unmapped_account') statusCode = 403;
            else if (result.error === 'inactive_user' || result.error === 'inactive_tenant') statusCode = 403;

            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Google accounts retrieved successfully.',
            data: {
                accounts: result.accounts || []
            }
        });

    } catch (error) {
        console.error('Get Google Accounts Error:', error);
        return res.status(500).json({ success: false, message: 'Unable to process your request at the moment. Please try again later.' });
    }
};

module.exports = {
    login,
    requestPasswordReset,
    confirmPasswordReset,
    getGoogleAccounts
};
