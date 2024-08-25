const connection = require('../config/connection');

connection.on('error', (error) => {
    console.error('Database connection error:', error);
});

connection.once('open', async () => {
    console.log('Connected to the database.');

    try {
        await connection.db.dropDatabase();
        console.log('Database dropped successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error dropping database:', error);
        process.exit(1);
    }
});