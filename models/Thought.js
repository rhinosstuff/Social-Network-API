// Importing Mongoose Moedels
const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

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
        return new Date(timestamp).toLocaleDateString('en-US');
      }
    },
    username: { type: String, required: true },
    reactions: [Reaction]
  },
  {
    toJSON: { virtuals: true }, // Includes virtuals in the JSON output
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