const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", bookRoutes);
app.use("/api", reviewRoutes);

module.exports = app;
