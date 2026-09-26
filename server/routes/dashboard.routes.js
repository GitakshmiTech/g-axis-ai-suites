// ==================================================================================================================
//    Admin Dashboard Routes
//    Defines routing for master dashboard endpoints.
// ==================================================================================================================
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Protect all routes in this file with authentication and Super Administrator authorization
router.use(authenticate);
router.use(authorizeRoles('Super Administrator', 'Super Admin'));

router.get('/summary', dashboardController.getSummary);
router.get('/revenue-chart', dashboardController.getRevenueChart);
router.get('/product-popularity', dashboardController.getProductPopularity);
router.get('/export', dashboardController.exportDashboard);

module.exports = router;
