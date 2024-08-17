// Importing Mongoose Moedels
const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        'Please enter a valid email address'
      ]
    },
    thoughts: [
      { type: Schema.Types.ObjectId, ref: 'thought' }
    ],
    friends: [
      { type: Schema.Types.ObjectId, ref: 'user' }
    ],
  },
  {
    toJSON: { virtuals: true }, // Includes virtuals in the JSON output
    id: false // Excludes the default 'id' field from the JSON output
  }
);

// Virtual field to get the number of friends
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Creating and exporting the User model
const User = model('user', userSchema);
module.exports = User;