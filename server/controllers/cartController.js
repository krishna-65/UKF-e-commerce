// controllers/cartController.js
import User from '../models/User.js';
import Product from '../models/Product.js';

// Add to cart or update quantity
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check product stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Find user and update cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if product already in cart
    const existingItemIndex = user.cartItems.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();

    // Populate cart items for response
    const populatedUser = await User.findById(userId)
      .populate({
        path: 'cartItems.product',
        select: 'name price images stock'
      });

    res.json({ 
      success: true,
      message: 'Product added to cart successfully',
      cart: populatedUser.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    ).populate({
      path: 'cartItems.product',
      select: 'name price images'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Product removed from cart',
      cart: user.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'cartItems.product',
        select: 'name price images stock'
      });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate total
    const cartTotal = user.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({ 
      success: true,
      cart: user.cartItems,
      totalItems: user.cartItems.length,
      cartTotal
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Update cart item quantity
    const user = await User.findOneAndUpdate(
      { 
        _id: userId,
        'cartItems.product': productId 
      },
      { $set: { 'cartItems.$.quantity': quantity } },
      { new: true }
    ).populate({
      path: 'cartItems.product',
      select: 'name price images'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User or cart item not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Cart updated successfully',
      cart: user.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const bulkAddToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.params?.id; // Safe access with optional chaining

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate input format
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    // Validate all items have required fields
    const invalidItems = items.filter(item => 
      !item?.productId || !item?.quantity
    );
    
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Each item must have productId and quantity'
      });
    }

    // Extract and validate product IDs
    const productIds = items.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return null;
      }
      return new mongoose.Types.ObjectId(item.productId);
    }).filter(Boolean);

    if (productIds.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product IDs provided'
      });
    }

    // Get all products
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(
      products.map(product => [product._id.toString(), product])
    );

    // Validate stock and prepare updates
    const validatedItems = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${product.name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        productData: {
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock
        }
      });
    }

    // Process cart updates
    const updatedCart = user.cartItems.map(item => ({ ...item.toObject() }));
    
    for (const item of validatedItems) {
      const existingItem = updatedCart.find(cartItem => 
        cartItem.product.toString() === item.product.toString()
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        updatedCart.push({
          product: item.product,
          quantity: item.quantity,
          addedAt: new Date(),
          productDetails: item.productData
        });
      }
    }

    user.cartItems = updatedCart;
    await user.save();

    // Prepare response
    const responseCart = updatedCart.map(item => ({
      ...item,
      product: item.productDetails || productMap.get(item.product.toString())
    }));

    const cartTotal = responseCart.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      cart: responseCart,
      totalItems: responseCart.length,
      cartTotal
    });

  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};