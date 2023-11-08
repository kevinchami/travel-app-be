import User from '../models/User.js';

export const addNewUser = async userData => {
  const user = await User.create(userData);
  return user;
};

export const getUsers = async () => {
  const users = await User.find();
  return users;
};
