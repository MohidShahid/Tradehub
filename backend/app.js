const express = require("express");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */


const cors = require("cors");
const app = express();
const morgan = require('morgan')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require('./middleware/error')
const userRoutes = require("./routes/auth")


app.use(express.json());
app.use("/", express.static("uploads"))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true, limit : "50mb"}));

app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);

app.use(ErrorHandler);

module.exports = app;