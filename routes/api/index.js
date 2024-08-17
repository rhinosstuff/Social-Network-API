// Importing Express Router
const router = require('express').Router();

// Importing User & Thought Routes 
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Mounting the User & Thought Routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// Exporting the Router
module.exports = router;