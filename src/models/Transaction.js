const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: Number, required: true },
  hash: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
