const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');

app.use(bodyParser.json());

// Routes
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
