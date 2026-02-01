const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");
const { ObjectId } = require("mongodb");

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

// EMPRUNTER
router.post("/borrow/:id", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("livre");

  const id = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  // Update conditionnel : seulement si disponible
  await collection.updateOne(
    { _id: new ObjectId(id), $or: [{ FIELD9: { $exists: false } }, { FIELD9: null }, { FIELD9: "" }] },
    { $set: { FIELD9: "borrowed" } }
  );

  res.redirect(`/?page=${page}&limit=${limit}`);
});

// RENDRE
router.post("/return/:id", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("livre");

  const id = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  // Update conditionnel : seulement si emprunté
  await collection.updateOne(
    { _id: new ObjectId(id), FIELD9: "borrowed" },
    { $set: { FIELD9: "" } } // ou null si tu préfères
  );

  res.redirect(`/?page=${page}&limit=${limit}`);
});

module.exports = router;