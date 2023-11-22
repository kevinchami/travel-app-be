import User from '../models/User.js';

import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

// Add new user
export const newUser = async userData => {
  try {
    const user = await User.create(userData);
    if (!user) {
      throw new Error('Failed to add user');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to add user');
  }
};

export const loginUser = async (identifier, password) => {
  try {
    // Find the user by either email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return null; // User not found
    }

    // Decrypt the stored password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET,
    ).toString(CryptoJS.enc.Utf8);

    console.log(decryptedPassword);

    // Compare the decrypted password with the provided password
    if (decryptedPassword === password) {
      return user; // Passwords match, return the user
    } else {
      return null; // Incorrect password
    }
  } catch (error) {
    throw new Error('Failed to login');
  }
};
