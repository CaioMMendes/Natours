import mongoose from 'mongoose';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string | undefined;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A User must have a e-mail'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'You must pass a valid e-mail'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A User must have a password'],
    trim: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A User must have a passwordConfirm'],
    trim: true,
    validate: {
      //this only work on save
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
