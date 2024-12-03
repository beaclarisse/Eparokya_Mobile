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
const BinyagRoutes = require("./routes/Binyag")
const FuneralRoutes = require("./routes/funeral")


const announcementCatgeoryRoutes = require("./routes/Announcement/announcementCategory");
const announcementRoutes = require("./routes/Announcement/announcement");
const announcementCommentRoutes = require("./routes/Announcement/AnnouncementComment");

const ministryCatgeoryRoutes = require("./routes/ministryCategory");
const memberYearBatchRoutes = require("./routes/Members/memberYearBatchCategory");
const memberRoutes = require("./routes/Members/members");

const resourceCategoryRoutes = require("./routes/Resource/ResourceCategory");
const postResourceRoutes = require("./routes/Resource/postResource");



app.use(`/api/v1/users`, usersRoutes);
app.use(`/api/v1/wedding`, weddingRoutes);
app.use(`/api/v1/ministryCategory`, ministryCatgeoryRoutes);
app.use(`/api/v1/announcementCategory`, announcementCatgeoryRoutes);
app.use(`/api/v1/announcement`, announcementRoutes);
app.use(`/api/v1/AnnouncementComment`, announcementCommentRoutes);
app.use(`/api/v1/memberYear`, memberYearBatchRoutes);
app.use(`/api/v1/member`, memberRoutes);
app.use(`/api/v1/resourceCategory`, resourceCategoryRoutes);
app.use(`/api/v1/postResource`, postResourceRoutes);
app.use(`/api/v1/binyag`, BinyagRoutes);
app.use(`/api/v1/funeral`, FuneralRoutes);


module.exports = app;

