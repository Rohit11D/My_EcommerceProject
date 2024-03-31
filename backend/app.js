const express = require('express');

const app = express();

const cookieParser = require("cookie-parser");

const errorMiddleware = require('./middleware/error');
// importing routes
const product = require("./routes/productRoute");
const user = require('./routes/userRoute');
const order = require("./routes/orderRoute");
// middleware to parse JSON bodies
app.use(express.json());
// to use cookies
app.use(cookieParser());
// using routes
app.use('/api/v1',product);

app.use('/api/v1',user);

app.use('/api/v1',order);
// middleware for error
app.use(errorMiddleware);
module.exports = app;