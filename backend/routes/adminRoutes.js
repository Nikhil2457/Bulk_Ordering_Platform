const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');

// Admin Login (No JWT)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminUser.findOne({ where: { username, password } });
  if (admin) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Login failed. Try again.' });
  }
});

module.exports = router;
