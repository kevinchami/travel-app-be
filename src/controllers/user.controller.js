import { userService } from '../services/index.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { emailService } from '../services/index.js';
import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    //const { userId } = req.user.id;
    const user = await userService.getUser(userId);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const getUserIdByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user ID
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error('Error getting user ID by email:', error.message);
    res.status(500).json({ error: 'Failed to get user ID by email' });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newName } = req.body;
    const updatedUser = await userService.updateUserName(userId, newName);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user name:', error.message);
    res.status(500).json({ error: 'Failed to update user name' });
  }
};

export const updatePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPicture } = req.body;
    console.log('new pic: ', newPicture);
    const updatedUser = await userService.updatePicture(userId, newPicture);
    console.log('updated user: ', updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user name:', error.message);
    res.status(500).json({ error: 'Failed to update user name' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    // Encrypt the password using CryptoJS
    const encryptedPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.SECRET,
    ).toString();

    const updatedUser = await userService.updatePassword(
      userId,
      encryptedPassword,
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
/*
export const updatePasswordByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;

    // Assuming you have the userId associated with the email in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Encrypt the password using CryptoJS
    const encryptedPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.SECRET,
    ).toString();

    const updatedUser = await userService.updatePassword(
      user._id, // Assuming userId is stored in _id field
      encryptedPassword,
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating password by email:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
*/

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Assuming you generate the OTP somewhere in your application
    const otp = generateOTP(4); // Implement your OTP generation logic

    console.log('opt: ', otp);
    // Encrypt the OTP using CryptoJS
    const encryptedOTP = CryptoJS.AES.encrypt(
      otp.toString(),
      process.env.SECRET,
    ).toString();

    // Save the encrypted OTP in your database or any storage mechanism

    // Send the OTP to the user's email
    await emailService.sendResetPasswordOTP(email, otp);

    res
      .status(200)
      .json({ message: 'Password reset OTP sent successfully', otp });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    res.status(500).json({ error: 'Failed to send password reset OTP' });
  }
};

function generateOTP(length) {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digits.length);
    OTP += digits[index];
  }

  return OTP;
}
