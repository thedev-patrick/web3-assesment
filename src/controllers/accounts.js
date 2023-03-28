const Account = require('../models/Account');
const web3 = require('../utils/web3');

// Get all Ethereum accounts that have interacted with the application
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Ether balance of a specific Ethereum account
const getAccountBalance = async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance, 'ether');
    res.json({ balance: balanceInEther });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAccounts,
  getAccountBalance
};
