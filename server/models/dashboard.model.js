// ==================================================================================================================
//    Dashboard Model
//    Handles database queries for KPIs and analytics.
// ==================================================================================================================
const { pool } = require('../config/database');

const Dashboard = {
    getTotalRevenue: async () => {
        try {
            // Assuming a payments or subscriptions table exists. Fallback to 0 if table doesn't exist yet.
            const [rows] = await pool.query(`
                SELECT COALESCE(SUM(amount), 0) as totalRevenue 
                FROM payments 
                WHERE status = 'completed' OR status = 'successful'
            `);
            return parseFloat(rows[0].totalRevenue) || 0;
        } catch (error) {
            // If table doesn't exist in early dev, return 0 instead of crashing
            if (error.code === 'ER_NO_SUCH_TABLE') return 0;
            throw error;
        }
    },

    getActiveTenantsCount: async () => {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM tenants WHERE status = 'active'`);
        return rows[0].count;
    },

    getActiveUsersCount: async () => {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE status = 'active'`);
        return rows[0].count;
    },

    getTenantChurnRate: async () => {
        const [activeRows] = await pool.query(`SELECT COUNT(*) as count FROM tenants WHERE status = 'active'`);
        const [inactiveRows] = await pool.query(`SELECT COUNT(*) as count FROM tenants WHERE status != 'active'`);
        
        const activeCount = activeRows[0].count;
        const inactiveCount = inactiveRows[0].count;
        const total = activeCount + inactiveCount;
        
        if (total === 0) return 0;
        
        const churnRate = (inactiveCount / total) * 100;
        return parseFloat(churnRate.toFixed(2));
    },

    getMonthlyRevenue: async (year) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    MONTHNAME(created_at) as period,
                    MONTH(created_at) as month_num,
                    COALESCE(SUM(amount), 0) as revenue
                FROM payments
                WHERE (status = 'completed' OR status = 'successful') 
                  AND YEAR(created_at) = ?
                GROUP BY MONTH(created_at), MONTHNAME(created_at)
                ORDER BY month_num
            `, [year]);
            return rows;
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') return [];
            throw error;
        }
    },

    getYearlyRevenue: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    YEAR(created_at) as period,
                    COALESCE(SUM(amount), 0) as revenue
                FROM payments
                WHERE status = 'completed' OR status = 'successful'
                GROUP BY YEAR(created_at)
                ORDER BY period DESC
                LIMIT 5
            `);
            return rows;
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') return [];
            throw error;
        }
    },

    getProductPopularity: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.id as productId,
                    p.name as productName,
                    COUNT(ts.id) as usageCount,
                    COUNT(ts.id) as installationCount
                FROM products p
                LEFT JOIN tenant_subscriptions ts ON p.id = ts.product_id AND ts.status = 'active'
                WHERE p.status = 'active'
                GROUP BY p.id, p.name
                ORDER BY usageCount DESC
                LIMIT 10
            `);
            return rows;
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') return [];
            throw error;
        }
    },

    getRecentTenants: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT id, name as tenantName, status 
                FROM tenants 
                ORDER BY created_at DESC 
                LIMIT 5
            `);
            return rows;
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') return [];
            throw error;
        }
    },

    getRecentSupportTickets: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT id as ticketId, title as ticketName, assigned_to as assignedAgent, priority 
                FROM support_tickets 
                ORDER BY created_at DESC 
                LIMIT 5
            `);
            return rows;
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') return [];
            throw error;
        }
    }
};

module.exports = Dashboard;
