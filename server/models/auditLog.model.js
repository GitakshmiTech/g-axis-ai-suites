// ==================================================================================================================
//    Audit Log Model
//    Handles all database operations related to tracking system audits and logs.
// ==================================================================================================================
const { pool } = require('../config/database');

const AuditLog = {
    createLog: async (userId, tenantId, action, details, reqInfo) => {
        try {
            await pool.query(
                `INSERT INTO audit_logs (user_id, tenant_id, action, status, ip_address, user_agent)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, tenantId, action, details, reqInfo.ip, reqInfo.userAgent]
            );
        } catch (e) {
            console.error('Audit logging failed', e);
        }
    }
};

module.exports = AuditLog;
