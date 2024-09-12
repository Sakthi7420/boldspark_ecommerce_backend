const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Add item to cart
exports.addItem = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
  
    
      if (!userId || !productId || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      let cartItem = await CartItem.findOne({ userId, productId });
  
      if (cartItem) {
        // Update quantity if item already exists
        cartItem.quantity += quantity;
      } else {
        // Create new cart item
        cartItem = new CartItem({ userId, productId, quantity });
      }
  
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Remove item from cart
exports.removeItem = async (req, res) => {
    try {
      const { userId, productId } = req.params;
  
      
      if (!userId || !productId) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      const result = await CartItem.deleteOne({ userId, productId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Get cart items for a user
exports.getCartItems = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const cartItems = await CartItem.find({ userId }).populate('productId');
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
