const express = require('express');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const web3 = new Web3('http://localhost:8545');

app.use(bodyParser.json());

// Get list of all Ethereum accounts that have interacted with the application
app.get('/accounts', async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    res.send(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create and sign a new Ethereum transaction using provided "from" account and send it to Ethereum network
app.post('/transactions', async (req, res) => {
  try {
    const { from, to, value } = req.body;
    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000;
    const nonce = await web3.eth.getTransactionCount(from);

    const txObject = {
      from: from,
      to: to,
      value: web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      nonce: web3.utils.toHex(nonce)
    };

    const tx = new Tx.Transaction(txObject, { chain: 'mainnet', hardfork: 'petersburg' });
    tx.sign(privateKey);

    const serializedTx = tx.serialize();
    const rawTx = '0x' + serializedTx.toString('hex');

    const result = await web3.eth.sendSignedTransaction(rawTx);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get Ether balance of specified Ethereum account
app.get('/balance/:account', async (req, res) => {
  try {
    const { account } = req.params;
    const balance = await web3.eth.getBalance(account);
    res.send(web3.utils.fromWei(balance, 'ether'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => console.log(`Backend service listening on port ${port}`));
