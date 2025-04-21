// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

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
    references: {
      model: 'Products', // name of the table
      key: 'id',
    },
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders', // name of the table
      key: 'id',
    },
  },
});

// Association method
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
  // Optional if you have a Product model:
  // OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
};

module.exports = OrderItem;
