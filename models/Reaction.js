// Importing Mongoose Models
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema to create Reaction model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
  },
  {
    toJSON: { 
      getters: true // Enables the custom getter for createdAt() 
    }, 
    id: false // Excludes the default 'id' field from the JSON output
  }
);

// Exporting the User Schema
module.exports = reactionSchema;