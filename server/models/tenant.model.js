// ==================================================================================================================
//    Tenant Model
//    Handles all database operations related to tenants/organizations.
// ==================================================================================================================
const { pool } = require('../config/database');

const Tenant = {
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT id, name, status FROM tenants WHERE id = ? LIMIT 1`,
            [id]
        );
        return rows[0] || null;
    }
};

module.exports = Tenant;
