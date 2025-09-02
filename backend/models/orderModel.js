const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String, // denormalized snapshot
        price: Number, // snapshot price at purchase
        quantity: { type: Number, required: true, min: 1 },
        subtotal: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, default: "cod" },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    pricing: {
      itemsTotal: Number,
      tax: Number,
      shipping: Number,
      grandTotal: Number,
      currency: { type: String, default: "USD" },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
