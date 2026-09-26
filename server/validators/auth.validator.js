// ==================================================================================================================
//    Auth Validators
//    Handles all request payload validation for authentication endpoints.
// ==================================================================================================================

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    next();
};

const validatePasswordResetRequest = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    next();
};

const validatePasswordResetConfirm = (req, res, next) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Password reset token is required.' });
    }
    if (!newPassword) {
        return res.status(400).json({ success: false, message: 'New password is required.' });
    }
    if (!confirmPassword) {
        return res.status(400).json({ success: false, message: 'Confirm password is required.' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const minLength = parseInt(process.env.PASSWORD_MIN_LENGTH) || 8;
    if (newPassword.length < minLength) {
        return res.status(400).json({ success: false, message: `Password must be at least ${minLength} characters long.` });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    next();
};

module.exports = {
    validateLogin,
    validatePasswordResetRequest,
    validatePasswordResetConfirm
};
