const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");

router.get("/", async (req, res) => {
  const db = await connectDB();
  const documents = await db
    .collection("livre")
    .find({})
    .limit(10)
    .toArray();

  res.render("catalogue", { documents });
});

module.exports = router;