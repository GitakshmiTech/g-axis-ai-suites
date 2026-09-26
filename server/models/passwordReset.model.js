// ==================================================================================================================
//    Password Reset Model
//    Handles all database operations related to password reset tokens.
// ==================================================================================================================
const { pool } = require('../config/database');

const PasswordReset = {
    countRecentRequests: async (userId) => {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as count FROM password_resets 
             WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
            [userId]
        );
        return rows[0].count;
    },

    createResetToken: async (userId, tokenHash, expiresAt) => {
        await pool.query(
            `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
            [userId, tokenHash, expiresAt]
        );
    },

    findByTokenHash: async (tokenHash, connection = pool) => {
        const [rows] = await connection.query(
            `SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token_hash = ? LIMIT 1`,
            [tokenHash]
        );
        return rows[0] || null;
    },

    markTokenAsUsed: async (tokenId, connection = pool) => {
        await connection.query(
            `UPDATE password_resets SET used_at = NOW() WHERE id = ?`,
            [tokenId]
        );
    }
};

module.exports = PasswordReset;
