const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  cardio: [
    {
      duration: {
        type: String,
        required: true,
      },
      zones: {
        type: String,
        required: true
      },
      method: {
        type: String
      },
      comments: {
        type: String
      }
    }
  ],
  resistance: [
    {
      exercise: {
        type: String,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      restInterval: {
        type: Number,
      },
      comments: {
        type: String
      }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
