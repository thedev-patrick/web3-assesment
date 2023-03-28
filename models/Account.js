const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  address: { type: String, unique: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
