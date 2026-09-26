require('dotenv').config({ path: './server/.env' });
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Nitesh@212121',
        database: process.env.DB_NAME || 'g_axis_db'
    });

    try {
        const email = 'tech99779@gmail.com';
        const rawPassword = 'UserPassword123!';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 1. Create a Tenant if none exists
        let [tenants] = await connection.query(`SELECT id FROM tenants LIMIT 1`);
        let tenantId;
        if (tenants.length === 0) {
            console.log('Creating dummy tenant...');
            const [result] = await connection.query(
                `INSERT INTO tenants (id, name, status) VALUES (UUID(), 'G-Axis Corp', 'active')`
            );
            // Fetch the UUID we just inserted
            const [newTenant] = await connection.query(`SELECT id FROM tenants WHERE name = 'G-Axis Corp' LIMIT 1`);
            tenantId = newTenant[0].id;
        } else {
            tenantId = tenants[0].id;
            // Ensure tenant is active
            await connection.query(`UPDATE tenants SET status = 'active' WHERE id = ?`, [tenantId]);
        }

        // 2. Check if user exists
        let [users] = await connection.query(`SELECT id FROM users WHERE email = ?`, [email]);
        let userId;
        
        if (users.length === 0) {
            console.log('Creating new admin user...');
            await connection.query(
                `INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, status, failed_attempts) 
                 VALUES (UUID(), ?, ?, ?, 'Tech', 'Admin', 'active', 0)`,
                [tenantId, email, hashedPassword]
            );
            const [newUser] = await connection.query(`SELECT id FROM users WHERE email = ?`, [email]);
            userId = newUser[0].id;
        } else {
            console.log('Updating existing admin user password and status...');
            userId = users[0].id;
            await connection.query(
                `UPDATE users SET password_hash = ?, status = 'active', locked_until = NULL, failed_attempts = 0 WHERE id = ?`,
                [hashedPassword, userId]
            );
        }

        // 3. Assign Role (Super Administrator)
        let [roles] = await connection.query(`SELECT id FROM roles WHERE name = 'Super Administrator' LIMIT 1`);
        let roleId;
        
        if (roles.length === 0) {
            console.log('Creating Super Administrator role...');
            await connection.query(`INSERT INTO roles (name) VALUES ('Super Administrator')`);
            const [newRole] = await connection.query(`SELECT id FROM roles WHERE name = 'Super Administrator' LIMIT 1`);
            roleId = newRole[0].id;
        } else {
            roleId = roles[0].id;
        }

        // Map role to user
        let [userRoles] = await connection.query(`SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?`, [userId, roleId]);
        if (userRoles.length === 0) {
            console.log('Assigning role to user...');
            await connection.query(`INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`, [userId, roleId]);
        }

        console.log('Seed completed successfully. You can now login with:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${rawPassword}`);

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await connection.end();
    }
}

seed();
