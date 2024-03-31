const express = require('express');

const app = express();

const errorMiddleware = require('./middleware/error');
// importing routes
const product = require("./routes/productRoute");

// middleware to parse JSON bodies
app.use(express.json());

// using routes
app.use('/api/v1',product);

// middleware for error
app.use(errorMiddleware);
module.exports = app;