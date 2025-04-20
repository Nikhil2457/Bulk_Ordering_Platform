// controllers/adminController.js
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Example of an admin-only route
const getAdminData = (req, res) => {
  res.json({ message: 'This is admin data', user: req.user });
};

module.exports = { getAdminData };
