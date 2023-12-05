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
    console.log('params:', req.params);
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
