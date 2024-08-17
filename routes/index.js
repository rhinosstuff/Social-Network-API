// Importing Express Router
const router = require('express').Router();

// Importing API Routes
const apiRoutes = require('./api');

// Mounting the API Routes
router.use('/api', apiRoutes);

// Handling Undefined Routes
router.use((req, res) => res.send('Wrong route!'));

// Exporting the Router
module.exports = router;