// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // Import Sequelize instance

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending', // Possible values: Pending, Confirmed, Out for Delivery, Delivered
  },
});

// Define the association between Order and OrderItem
Order.associate = (models) => {
  Order.hasMany(models.OrderItem, { as: 'items', foreignKey: 'orderId' });
};

module.exports = Order;
