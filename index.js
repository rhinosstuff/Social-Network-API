// Imports and Setup
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// Port and Express App Initialization
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing Middleware
app.use(routes);

// Database Connection and Server Start
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});