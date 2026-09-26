// ==================================================================================================================
//    Dashboard Service
//    Handles business logic for the Master Dashboard.
// ==================================================================================================================
const Dashboard = require('../models/dashboard.model');
const AuditLog = require('../models/auditLog.model');

const getMasterSummary = async (reqInfo) => {
    try {
        const [totalRevenue, activeTenants, activeUsers, tenantChurnRate] = await Promise.all([
            Dashboard.getTotalRevenue(),
            Dashboard.getActiveTenantsCount(),
            Dashboard.getActiveUsersCount(),
            Dashboard.getTenantChurnRate()
        ]);

        // Audit the access
        await AuditLog.createLog(reqInfo.userId, reqInfo.tenantId, 'DASHBOARD_ACCESS', 'Master dashboard summary accessed', reqInfo);

        return {
            success: true,
            data: {
                totalRevenue,
                activeTenants,
                activeUsers,
                tenantChurnRate
            }
        };
    } catch (error) {
        console.error('Dashboard Service Error:', error);
        
        // Custom error mapping based on requirement
        if (error.message && error.message.includes('revenue')) {
            return { error: 'revenue_unavailable', message: 'Revenue data unavailable' };
        }
        if (error.message && error.message.includes('tenant')) {
            return { error: 'tenant_unavailable', message: 'Tenant data unavailable' };
        }
        
        return { error: 'data_unavailable', message: 'Dashboard data is currently unavailable. Please try again later.' };
    }
};

const getRevenueChart = async (view, year, reqInfo) => {
    try {
        let items = [];
        
        if (view === 'monthly') {
            const currentYear = year || new Date().getFullYear();
            const rows = await Dashboard.getMonthlyRevenue(currentYear);
            
            // Format result: ensure all months are present or just return db result
            // For simplicity, just mapping db result
            items = rows.map(r => ({
                period: r.period,
                revenue: parseFloat(r.revenue)
            }));
        } else if (view === 'yearly') {
            const rows = await Dashboard.getYearlyRevenue();
            items = rows.map(r => ({
                period: r.period.toString(),
                revenue: parseFloat(r.revenue)
            }));
        }

        const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);

        // Audit the access
        await AuditLog.createLog(reqInfo.userId, reqInfo.tenantId, 'DASHBOARD_REVENUE_CHART_ACCESS', `Revenue chart accessed (${view})`, reqInfo);

        return {
            success: true,
            data: {
                view,
                year: view === 'monthly' ? parseInt(year) || new Date().getFullYear() : null,
                currency: process.env.DEFAULT_CURRENCY || 'INR',
                items,
                totalRevenue
            }
        };

    } catch (error) {
        console.error('Revenue Chart Service Error:', error);
        if (error.message && error.message.includes('revenue')) {
            return { error: 'revenue_unavailable', message: 'Revenue data unavailable' };
        }
        return { error: 'analytics_unavailable', message: 'Analytics data is temporarily unavailable.' };
    }
};

const getProductPopularity = async (reqInfo) => {
    try {
        const rows = await Dashboard.getProductPopularity();

        const products = rows.map(r => ({
            productId: r.productId,
            productName: r.productName,
            usageCount: parseInt(r.usageCount) || 0,
            installationCount: parseInt(r.installationCount) || 0
        }));

        // Audit the access
        await AuditLog.createLog(reqInfo.userId, reqInfo.tenantId, 'DASHBOARD_PRODUCT_POPULARITY_ACCESS', 'Product popularity accessed', reqInfo);

        return {
            success: true,
            data: {
                products
            }
        };

    } catch (error) {
        console.error('Product Popularity Service Error:', error);
        return { error: 'product_data_unavailable', message: 'Product data unavailable' };
    }
};

const exportDashboardData = async (reqInfo) => {
    try {
        const [summary, revenue, products, tenants, tickets] = await Promise.all([
            getMasterSummary(reqInfo),
            getRevenueChart('monthly', new Date().getFullYear(), reqInfo),
            Dashboard.getProductPopularity(),
            Dashboard.getRecentTenants(),
            Dashboard.getRecentSupportTickets()
        ]);

        if (summary.error) {
            return { error: 'data_unavailable', message: 'Dashboard data is currently unavailable. Please try again later.' };
        }

        // Build CSV string
        let csv = '';

        // 1. KPI Summary
        csv += '--- KPI SUMMARY ---\n';
        csv += 'Total Revenue,Active Tenants,Active Users,Tenant Churn Rate\n';
        csv += `"${summary.data.totalRevenue}","${summary.data.activeTenants}","${summary.data.activeUsers}","${summary.data.tenantChurnRate}%"\n\n`;

        // 2. Revenue Analytics
        csv += '--- REVENUE ANALYTICS (MONTHLY) ---\n';
        csv += 'Period,Revenue\n';
        if (!revenue.error && revenue.data.items) {
            revenue.data.items.forEach(item => {
                csv += `"${item.period}","${item.revenue}"\n`;
            });
        }
        csv += '\n';

        // 3. Product Popularity
        csv += '--- PRODUCT POPULARITY ---\n';
        csv += 'Product Name,Usage Count,Installation Count\n';
        products.forEach(p => {
            csv += `"${p.productName}","${p.usageCount}","${p.installationCount}"\n`;
        });
        csv += '\n';

        // 4. Recent Tenants
        csv += '--- RECENT TENANTS ---\n';
        csv += 'Tenant ID,Tenant Name,Status\n';
        tenants.forEach(t => {
            csv += `"${t.id}","${t.tenantName}","${t.status}"\n`;
        });
        csv += '\n';

        // 5. Recent Support Tickets
        csv += '--- RECENT SUPPORT TICKETS ---\n';
        csv += 'Ticket ID,Ticket Name,Assigned Agent,Priority\n';
        tickets.forEach(t => {
            csv += `"${t.ticketId}","${t.ticketName}","${t.assignedAgent}","${t.priority}"\n`;
        });
        csv += '\n';

        // Audit the access
        await AuditLog.createLog(reqInfo.userId, reqInfo.tenantId, 'DASHBOARD_EXPORT', 'Dashboard data exported', reqInfo);

        return {
            success: true,
            csv
        };

    } catch (error) {
        console.error('Export Dashboard Service Error:', error);
        return { error: 'export_failed', message: 'Unable to export dashboard data. Please try again later.' };
    }
};

module.exports = {
    getMasterSummary,
    getRevenueChart,
    getProductPopularity,
    exportDashboardData
};
