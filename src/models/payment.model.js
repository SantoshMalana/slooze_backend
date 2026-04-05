const mongoose = require('mongoose');
const { PAYMENT_METHODS } = require('../constants');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    details: {
      cardLast4: { type: String },
      cardBrand: { type: String },
      upiId: { type: String },
      billingName: { type: String },
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
