const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (error) => {
    console.error('Database connection error:', error);
});

connection.on('open', async () => {
    console.log('Connected to the database.');

    try {
        const users = await User.find();
        const thoughts = await Thought.find();
        // const reactions = await Reaction.find();

        console.log('Collections created:', users, thoughts);
    } catch (error) {
        console.error('Error querying collections:', error);
    }
});