require('dotenv').config();

const app = require('./app');
const { testDatabaseConnection } = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    const databaseConnected = await testDatabaseConnection();

    if (!databaseConnected) {
        console.error('❌ Server startup stopped because database connection failed.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 G-Axis API running on port ${PORT}`);
    });
};

startServer();