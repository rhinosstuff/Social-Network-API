// Importing Mongoose Methods
const { connect, connection } = require('mongoose')

// Defining the Connection String
const connectionString = 'mongodb://127.0.0.1:27017/socialNetworkDB';

// Connecting to MongoDB
connect(connectionString);

// Exporting the Connection
module.exports = connection;