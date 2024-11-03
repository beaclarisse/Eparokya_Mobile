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
const ministryCatgeoryRoutes = require("./routes/ministryCategory");

app.use(`/api/v1/users`, usersRoutes);
app.use(`/api/v1/wedding`, weddingRoutes);
app.use(`/api/v1/ministryCategory`, ministryCatgeoryRoutes);

module.exports = app;

