//const User = require('../models/User');
import { log } from 'console';
import User from '../models/User.js';
import { authService } from '../services/index.js';
//const CryptoJS = require('crypto');
//const jwt = require('jsonwebtoken');
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

export const newUser = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;

    // Encrypt the password using CryptoJS
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET,
    ).toString();

    // Create a new user
    const userData = {
      username,
      email,
      password: encryptedPassword,
      profile,
    };

    const user = await authService.newUser(userData);

    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating a new user:', error.message);
    return res.status(500).json({ error: 'Failed to create a new user' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('====================================');
  console.log('identifier: ', email);
  console.log('password: ', password);
  console.log('====================================');

  try {
    const user = await authService.loginUser(email, password);

    console.log('====================================');
    console.log('user in controller: ', email);
    console.log('====================================');

    if (user) {
      // User authenticated, generate JWT token
      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      return res
        .status(200)
        .json({ message: 'Login successful', user, token: userToken });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
