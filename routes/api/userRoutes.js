// Importing Express Router
const router = require('express').Router();

// Importing User Controllers
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

          // Setting Controller End Points 
// /api/users
router
  .route('/')
  .get(getUsers)
  .post(createUser);

// /api/users/:userId
router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/:userId/friends/:friendId
router
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

// Exporting the Router
module.exports = router;