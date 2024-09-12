const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);

    const { userId, items, status='pending', name, email, address, city, zip, phoneNumber, totalAmount } = req.body;
    
    // Validate required fields
    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate total amount
    let calculatedTotalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      calculatedTotalAmount += product.price * item.quantity;
    }

    if (calculatedTotalAmount !== totalAmount) {
      return res.status(400).json({ message: 'Total amount does not match calculated total' });
    }

    
    // Create and save the new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      status,
      name,
      email,
      address,
      city,
      zip,
      phoneNumber
    });

    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate('items.productId', 'name image');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get orders for a user
exports.getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const orders = await Order.find({ userId }).populate('items.productId', 'name image');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('received status', status);
    
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// orderController.js

// Get the count of all orders
exports.getOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


