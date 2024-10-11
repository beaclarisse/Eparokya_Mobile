const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));

app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const usersRoutes = require("./routes/user");
const weddingRoutes = require("./routes/wedding");
// const productsRoutes = require("./routes/product");
// const orderRoutes = require("./routes/order");
// const reviewRoutes = require("./routes/review");

app.use(`/api/v1/users`, usersRoutes);
app.use(`/api/v1/wedding`, weddingRoutes);
// app.use(`/api/v1/products`, productsRoutes);
// app.use(`/api/v1/orders`, orderRoutes);
// app.use(`/api/v1/reviews`, reviewRoutes);


module.exports = app;

