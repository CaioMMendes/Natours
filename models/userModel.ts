import mongoose from 'mongoose';

interface User {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A User must have a e-mail'],
    trim: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A User must have a password'],
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A User must have a passwordConfirm'],
    trim: true,
  },
});
