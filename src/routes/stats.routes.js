const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Stats OK");
});

module.exports = router;