// ==================================================================================================================
//    User Model
//    Handles all database operations related to users.
// ==================================================================================================================
const { pool } = require('../config/database');

const User = {
    findByEmail: async (email) => {
        const [rows] = await pool.query(
            `SELECT u.id, u.email, u.password_hash, u.status, u.tenant_id, u.failed_attempts, u.locked_until
             FROM users u
             WHERE u.email = ? LIMIT 1`,
            [email]
        );
        return rows[0] || null;
    },

    findByEmailWithTenantStatus: async (email) => {
        const [rows] = await pool.query(
            `SELECT u.id, u.email, u.status, u.tenant_id, t.status as tenant_status
             FROM users u
             LEFT JOIN tenants t ON u.tenant_id = t.id
             WHERE u.email = ? LIMIT 1`,
            [email]
        );
        return rows[0] || null;
    },

    findByIdWithTenantStatus: async (id, connection = pool) => {
        const [rows] = await connection.query(
            `SELECT u.id, u.status, u.tenant_id, t.status as tenant_status 
             FROM users u 
             LEFT JOIN tenants t ON u.tenant_id = t.id 
             WHERE u.id = ? LIMIT 1`,
            [id]
        );
        return rows[0] || null;
    },

    incrementFailedAttempts: async (userId, failedAttempts) => {
        await pool.query(`UPDATE users SET failed_attempts = ? WHERE id = ?`, [failedAttempts, userId]);
    },

    lockAccount: async (userId, failedAttempts, lockUntil) => {
        await pool.query(
            `UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?`,
            [failedAttempts, lockUntil, userId]
        );
    },

    resetFailedAttempts: async (userId) => {
        await pool.query(`UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?`, [userId]);
    },

    updatePassword: async (userId, newPasswordHash, connection = pool) => {
        await connection.query(
            `UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?`,
            [newPasswordHash, userId]
        );
    },

    getUserRoles: async (userId) => {
        const [rows] = await pool.query(
            `SELECT r.name 
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.id
             WHERE ur.user_id = ?`,
            [userId]
        );
        return rows.map(r => r.name);
    }
};

module.exports = User;
