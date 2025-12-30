const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/items', require('./routes/item.routes'));

module.exports = app;
