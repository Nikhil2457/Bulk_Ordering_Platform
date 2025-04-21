// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
const registerUser = async (req, res) => {
    const { username, password } = req.body;
  
    // Validate input fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }
  
    // Check if the username already exists
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Create and save the user to the database
      const user = await User.create({
        username,
        password: hashedPassword,
      });
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
      // Respond with the user's info and the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  };
  
// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  
  res.status(201).json({
    id: user.id,
    username: user.username,
  });
  
};

module.exports = { registerUser, loginUser };
