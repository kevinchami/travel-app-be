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

export const getUserIdByEmail = async email => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Return the user ID
    return user._id;
  } catch (error) {
    throw new Error('Failed to get user ID by email');
  }
};

export const updateUserName = async (userId, newName) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: newName },
      { new: true },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to update user name');
  }
};

export const updatePicture = async (userId, newPicture) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profile: newPicture },
      { new: true },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to update user name');
  }
};

export const updatePassword = async (userId, newPassword) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to update password');
  }
};

/*
export const updatePasswordWithEmail = async (email, newPassword) => {
  try {
    // Step 1: Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Update the user's password with the new password
    user.password = newPassword;

    // Step 3: Save the changes
    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update password');
  }
};
*/
