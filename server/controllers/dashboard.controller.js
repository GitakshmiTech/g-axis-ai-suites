const dashboardService = require('../services/dashboard.service');

// ==================================================================================================================
//    Get Master Dashboard Summary API Controller
// ==================================================================================================================
const getSummary = async (req, res) => {
    try {
        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            userId: req.user.userId,
            tenantId: req.user.tenantId
        };

        const result = await dashboardService.getMasterSummary(reqInfo);

        if (result.error) {
            let statusCode = 500;
            if (result.error === 'revenue_unavailable' || result.error === 'tenant_unavailable' || result.error === 'data_unavailable') {
                statusCode = 503; // Service Unavailable / Data Unavailable
            }
            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Dashboard summary retrieved successfully.',
            data: result.data
        });

    } catch (error) {
        console.error('Dashboard Controller Error:', error);
        return res.status(500).json({ success: false, message: 'A temporary system error occurred. Please try again later.' });
    }
};

// ==================================================================================================================
//    Get Revenue Chart API Controller
// ==================================================================================================================
const getRevenueChart = async (req, res) => {
    try {
        const { view = 'monthly', year } = req.query;

        if (view !== 'monthly' && view !== 'yearly') {
            return res.status(400).json({ success: false, message: 'The selected reporting period is not available.' });
        }

        // Validate year if provided
        if (year && isNaN(parseInt(year))) {
             return res.status(400).json({ success: false, message: 'Invalid year provided.' });
        }

        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            userId: req.user.userId,
            tenantId: req.user.tenantId
        };

        const result = await dashboardService.getRevenueChart(view, year, reqInfo);

        if (result.error) {
            let statusCode = 500;
            if (result.error === 'revenue_unavailable' || result.error === 'analytics_unavailable') {
                statusCode = 503; 
            }
            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Revenue data retrieved successfully.',
            data: result.data
        });

    } catch (error) {
        console.error('Revenue Chart Controller Error:', error);
        return res.status(500).json({ success: false, message: 'A temporary system error occurred. Please try again later.' });
    }
};

// ==================================================================================================================
//    Get Product Popularity API Controller
// ==================================================================================================================
const getProductPopularity = async (req, res) => {
    try {
        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            userId: req.user.userId,
            tenantId: req.user.tenantId
        };

        const result = await dashboardService.getProductPopularity(reqInfo);

        if (result.error) {
            let statusCode = 500;
            if (result.error === 'product_data_unavailable' || result.error === 'analytics_unavailable') {
                statusCode = 503; 
            }
            return res.status(statusCode).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Product popularity retrieved successfully.',
            data: result.data
        });

    } catch (error) {
        console.error('Product Popularity Controller Error:', error);
        return res.status(500).json({ success: false, message: 'A temporary system error occurred. Please try again later.' });
    }
};

// ==================================================================================================================
//    Export Master Dashboard Data API Controller
// ==================================================================================================================
const exportDashboard = async (req, res) => {
    try {
        const reqInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            userId: req.user.userId,
            tenantId: req.user.tenantId
        };

        const result = await dashboardService.exportDashboardData(reqInfo);

        if (result.error) {
            let statusCode = 500;
            if (result.error === 'data_unavailable') {
                statusCode = 503; 
            }
            return res.status(statusCode).json({ success: false, message: result.message });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `master-dashboard-report-${dateStr}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        return res.status(200).send(result.csv);

    } catch (error) {
        console.error('Export Dashboard Controller Error:', error);
        return res.status(500).json({ success: false, message: 'A temporary system error occurred. Please try again later.' });
    }
};

module.exports = {
    getSummary,
    getRevenueChart,
    getProductPopularity,
    exportDashboard
};
