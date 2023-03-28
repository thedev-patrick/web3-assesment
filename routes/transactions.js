const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const web3 = require('../utils/web3');

// Create and send a new Ethereum transaction
router.post('/', async (req, res) => {
  try {
    const { from, to, value } = req.body;
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await web3.eth.getBlock("latest").gasLimit;
    const nonce = await web3.eth.getTransactionCount(from, "pending");
    const txObject = {
      from: from,
      to: to,
      value: web3.utils.toWei(value, 'ether'),
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      nonce: nonce
    };
    const signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    const transaction = new Transaction({
      from: from,
      to: to,
      value: value,
      hash: txHash
    });
    await transaction.save();
    res.status(201).json({ message: 'Transaction sent successfully', hash: txHash });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
