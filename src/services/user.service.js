import User from '../models/User.js';

export const addNewUser = async userData => {
  const user = await User.create(userData);
  return user;
};

export const getUsers = async () => {
  const users = await User.find();
  return users;
};

export const deleteUser = async userId => {
  try {
    const result = await User.findByIdAndRemove(userId);
    if (!result) {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};

export const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};
