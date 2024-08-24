const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select('-__v');

      res.status(200).json({ data : thoughts });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error fetching thoughts: ${error}`);
    }
  },

  // Get single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

      if (!thought) {
          return res.status(404).json({ message: `Invalid thought id: ${req.params.thoughtId}.` });
      }

      res.status(200).json({ data : thought });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error fetching thought id: ${req.params.userId}: ${error}`);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      // Find the user by username
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
          return res.status(404).json({ message: `Invalid username: ${req.body.username}, please try again.` });
      }

      const thought = await Thought.create(req.body);
      
      // Update the user's thoughts array
      user.thoughts.push(thought._id);
      await user.save();

      res.status(201).json({ data : thought, message: 'Thought created!' });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error creating thought: ${error}`);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId }, req.body, { new: true }
      );

      if (!thought) {
          res.status(404).json({ message: `Invalid thought id: ${req.params.thoughtId}.` });
      }

      res.status(200).json({ data : thought, message: 'Thought updated successfullly!' });
    } catch (error) {
      res.status(500).json({error, message: 'Internal server error.' });
      console.error(`Error updating thought id: ${req.params.thoughtId}: ${error}`);
    }
  },

  // Delete a thought and remove Id from associated user
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      
      if (!thought) {
          return res.status(404).json({ message: `Invalid thought id: ${req.params.thoughtId}.` });
      }
      
      // Find the user to remove the thought ID from their thought array
      const user = await User.findOneAndUpdate(
        { username: thought.username }, 
        { $pull: {thoughts: req.params.thoughtId }}, 
        { new: true }
      );

      res.status(200).json({ message: `Deleted thought, and removed from: ${user.username}!` });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error deleting thought id: ${req.params.thoughtId}: ${error}`);
    }
  },

  // Create a reaction
  async createReaction(req, res) {
    try {
      // Find the user by username
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
          return res.status(404).json({ message: `Invalid username: ${req.body.username}, please try again.` });
      }

      // Find the thought by Id
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: `Invalid thought id: ${req.params.thoughtId}.` });
      }
      
      // Update the thoughts reactions array
      thought.reactions.push(req.body);
      await thought.save();

      res.status(200).json({ thought, message: 'Reaction added successfully!' });
    } catch(error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error creating reaction based on thought id: ${req.params.thoughId}: ${error}`);
    }
  },

  // Delete a reacation
  async deleteReaction(req, res) {
    try {
      // Find the thought by Id
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: `Invalid thought id: ${req.params.thoughtId}.` });
      }

      const thoughtHasReaction = thought.reactions.some(reaction => reaction.reactionId.toString() === req.params.reactionId);

      if (!thoughtHasReaction) {
        return res.status(404).json({ message: `Reaction with id: ${req.params.reactionId} not found.` });
      }

      // Remove the reaction from the thought's reactions array
      thought.reactions = thought.reactions.filter(reaction => reaction.reactionId.toString() !== req.params.reactionId);
      await thought.save();

      res.status(200).json({ thought, message:  `Removed reactionId: ${req.params.reactionId}!` });
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error.' });
      console.error(`Error deleting reaction from thought id: ${req.params.thoughtId}: ${error}`);
    }
  }
};