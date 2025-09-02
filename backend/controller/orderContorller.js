const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Helper to compute pricing
function computePricing(items) {
  const itemsTotal = items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
  const tax = +(itemsTotal * 0.1).toFixed(2); // 10% sample tax
  const shipping = itemsTotal > 100 ? 0 : 10; // flat example logic
  const grandTotal = +(itemsTotal + tax + shipping).toFixed(2);
  return { itemsTotal, tax, shipping, grandTotal };
}

// POST /api/orders
async function createOrder(req, res) {
  try {
    const userId = req.user?._id;
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    // Enrich items with product snapshot
    const enriched = [];
    for (const line of items) {
      if (!line.product || !line.quantity) {
        return res
          .status(400)
          .json({ message: "Each item needs product and quantity" });
      }
      const productDoc = await Product.findById(line.product);
      if (!productDoc) {
        return res
          .status(400)
          .json({ message: `Product not found: ${line.product}` });
      }
      const quantity = Math.max(1, line.quantity);
      const subtotal = productDoc.price * quantity;
      enriched.push({
        product: productDoc._id,
        name: productDoc.name,
        price: productDoc.price,
        quantity,
        subtotal,
      });
    }
    const pricing = computePricing(enriched);
    const order = await Order.create({
      user: userId,
      items: enriched,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || "cod",
      pricing: { ...pricing },
      status: "pending",
      statusHistory: [{ status: "pending" }],
    });
    return res.status(201).json(order);
  } catch (err) {
    console.error("[Order] create error", err);
    return res.status(500).json({ message: err.message });
  }
}

// GET /api/orders/my (current user's orders)
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/orders/:id/pay (mark paid)
async function payOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "paid";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/orders/:id/status (admin)
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status || order.status;
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/orders (admin list all)
async function listOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  updateStatus,
  listOrders,
};
