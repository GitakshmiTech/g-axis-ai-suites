const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const testDatabaseConnection = async () => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS currentTime');

        console.log('✅ MySQL connected successfully');
        console.log('✅ Database connection test successful');
        console.log('🕒 Database time:', rows[0].currentTime);

        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);

        return false;
    }
};

module.exports = {
    pool,
    testDatabaseConnection,
};