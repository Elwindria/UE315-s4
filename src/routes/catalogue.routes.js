const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");

router.get("/", async (req, res) => {
  const db = await connectDB();

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const collection = db.collection("livre");

  const total = await collection.countDocuments({});
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const safePage = Math.min(page, totalPages);
  const safeSkip = (safePage - 1) * limit;

  const documents = await collection
    .find({})
    .skip(safeSkip)
    .limit(limit)
    .toArray();

  res.render("catalogue", {
    documents,
    page: safePage,
    limit,
    total,
    totalPages,
  });
});

module.exports = router;