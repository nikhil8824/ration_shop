const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin, requireCustomer } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', authenticateToken, requireCustomer, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.pincode').matches(/^[0-9]{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('paymentMethod').optional().isIn(['cash_on_delivery', 'online', 'card']).withMessage('Invalid payment method'),
  body('notes').optional().isString().isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, deliveryAddress, paymentMethod = 'cash_on_delivery', notes } = req.body;

    // Validate products and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.discountedPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.discountedPrice,
        total: itemTotal
      });
    }

    // Calculate delivery fee (free for orders above ₹500)
    const deliveryFee = subtotal >= 500 ? 0 : 50;
    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      notes,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate product details for response
    await order.populate('items.product', 'name image unit');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private (Customer)
router.get('/', authenticateToken, requireCustomer, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('items.product', 'name image unit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNext: skip + orders.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image unit category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const updateData = { status };

    // Set deliveredAt when status is delivered
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('items.product', 'name image unit');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get('/admin/all', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  query('user').optional().isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, status, user } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image unit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNext: skip + orders.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/admin/stats
// @desc    Get order statistics (Admin only)
// @access  Private (Admin)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

module.exports = router;



