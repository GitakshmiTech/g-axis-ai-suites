// ==================================================================================================================
//    Auth Routes
//    Defines routing for authentication endpoints (Login, Password Reset, SSO).
// ==================================================================================================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

router.post('/login', authValidator.validateLogin, authController.login);
router.post('/password-reset/request', authValidator.validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset/confirm', authValidator.validatePasswordResetConfirm, authController.confirmPasswordReset);
router.get('/sso/google/accounts', authController.getGoogleAccounts);

module.exports = router;
