// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // Import Sequelize instance

const OrderItem = sequelize.define('OrderItem', {
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Only associate after defining all models
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
};

module.exports = OrderItem;
