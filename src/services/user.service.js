const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) return { success: false, error: 'Invalid credentials' };
    
    // const valid = await bcrypt.compare(password, user.password);
    // if (!valid) return { success: false, error: 'Invalid credentials' };
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return { success: true, data: { user, token } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


const getAllUsers = async () => {
  try {
    const users = await User.find();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user 
      ? { success: true, data: user } 
      : { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updateUser = async (id, data) => {
  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user 
      ? { success: true, data: user } 
      : { success: false, error: 'Update failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  register, login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};