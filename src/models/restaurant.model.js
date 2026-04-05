const mongoose = require('mongoose');
const { COUNTRIES } = require('../constants');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, trim: true },
  isAvailable: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: {
      type: String,
      enum: Object.values(COUNTRIES),
      required: true,
    },
    cuisine: { type: String, trim: true },
    address: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    menuItems: [menuItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
