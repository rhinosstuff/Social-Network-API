// Importing Mongoose Models and Reaction Schema
const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }
    },
    username: { type: String, required: true },
    reactions: [Reaction]
  },
  {
    toJSON: { 
      virtuals: true, // Includes virtuals in the JSON output
      getters: true // Enables the custom getter for createdAt() 
    }, 
    id: false // Excludes the default 'id' field from the JSON output
  }
);

// Virtual field to get the number of reactions
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Creating and exporting the User model
const Thought = model('thought', thoughtSchema);
module.exports = Thought;