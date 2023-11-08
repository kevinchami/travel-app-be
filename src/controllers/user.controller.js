import { userService } from '../services/index.js';

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
