const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      
      res.status(200).json({ data : users });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error fetching users: ${error}`);
    }
  },
  
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v');

      if (!user) {
          return res.status(404).json({ message: `Invalid user id: ${req.params.userId}.` });
      }

      res.status(200).json({ data : user });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error fetching user id: ${req.params.userId}: ${error}`);
    }
  },

  // Create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      res.status(201).json({ data: user, message: 'User created successfully.' });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error creating user: ${error}`);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      // Check to see if username is being passed, if yes update thoughts and reactions
      if (req.body.username) {
        const oldUserName = await User.findOne({ _id: req.params.userId }).select('-__v');
        
        // Updates user thoughts with new username
        await Thought.updateMany(
          { username: oldUserName.username }, 
          { $set: { username: req.body.username } }
        );

        // Updates user reactions with new username
        await Thought.updateMany(
          { 'reactions.username': oldUserName.username },
          { $set: { 'reactions.$[elem].username': req.body.username } },
          { arrayFilters: [{ 'elem.username': oldUserName.username }] }
        );
      }

      // Update user
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId}, req.body, { new: true }
      );
      
      if (!user) {
          return res.status(404).json({ message: `Invalid user id: ${req.params.userId}.` });
      }
      
      res.status(200).json({ data : user, message: 'User updated successfully.'  });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error updating user id: ${req.params.userId}: ${error}`);
    }
  },

  // Delete user and associated thoughts
  async deleteUser(req, res) {
    try {
      // Find the userby Id and Delete
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      
      if (!user) {
          return res.status(404).json({ message: `Invalid user id: ${req.params.userId}.` });
      }

      // Removes friendId from any associated user
      await User.updateMany(
        { friends: req.params.userId }, 
        { $pull: { friends: req.params.userId } }, 
        { new: true }
      ); 

      // Removes user reactions from any associated thought
      await Thought.updateMany(
        { 'reactions.username': user.username },
        { $pull: { reactions: { username: user.username } } }, 
        { new: true }
      );

      // Check if user has thoughts
      const userThoughts = user.thoughts.length
      
      if (userThoughts === 0) {
        return res.status(200).json({ message: `Deleted User: ${user.username}.` });
      }

      // Deletes any associated thoughts created by user
      await Thought.deleteMany({ username: user.username });  

      res.status(200).json({ message: `Deleted User: ${user.username}, and associated thoughts.` });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error deleting user id: ${req.params.userId}: ${error}`);
    }
  },

  // Add a friend
  async addFriend(req, res) {
    try {
      // Find the user by Id
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: `Invalid user id: ${req.params.userId}.` });
      }

      // Check if the friend exists
      const friendExists = await User.findOne({ _id: req.params.friendId }).select('-__v');

      if (!friendExists) {
        return res.status(404).json({ message: `Invalid friend id: ${req.params.friendId}.` });
      }

      // Check if the friend is in the user's friends array
      const userHasFriend = user.friends.some(friend => friend.toString() === req.params.friendId);

      if (userHasFriend) {
        return res.status(409).json({ message: `User is already friends with id: ${req.params.friendId}.` });
      }
      
      // If friend exists and is not a friend, then add to the user's friends array
      user.friends.push(req.params.friendId);
      await user.save();

      res.status(200).json({ user, message: `Added friend id: ${req.params.friendId}!` });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error adding friend to user id: ${req.params.userId}: ${error}`);
    }
  },

  // Remove a friend
  async removeFriend(req, res) {
    try {
      // Find the user by Id
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: `Invalid user id: ${req.params.userId}.` });
      }

      // Check if the friend exists
      const friendExists = await User.findOne({ _id: req.params.friendId }).select('-__v');

      if (!friendExists) {
        return res.status(404).json({ message: `Invalid friend id: ${req.params.friendId}.` });
      }

      // Check if the friend is in the user's friends array
      const userHasFriend = user.friends.some(friend => friend.toString() === req.params.friendId);

      if (!userHasFriend) {
        return res.status(409).json({ message: `User is not friends with id: ${req.params.friendId}.` });
      }

      // Remove the friend from the user's friends array
      user.friends = user.friends.filter(friend => friend.toString() !== req.params.friendId);
      await user.save();

      res.status(200).json({ user, message: `Removed friend id: ${req.params.friendId}!` });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error removing friend from user id: ${req.params.userId}: ${error}`);
    }
  }
};