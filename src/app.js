const express = require("express");
const path = require("path");

const catalogueRoutes = require("./routes/catalogue.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", catalogueRoutes);
app.use("/stats", statsRoutes);

// 404
app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

module.exports = app;