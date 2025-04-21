const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const AdminUser = require('./models/AdminUser');
const db = require('./utils/db'); // Sequelize instance

// Setup associations
Cart.belongsTo(Product, { foreignKey: 'productId' });
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// CORS setup
app.use(cors({
  origin: 'https://bulk-ordering-platform.vercel.app',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Handle OPTIONS preflight request (required by CORS)
app.options('*', cors());

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Sync DB
db.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));
