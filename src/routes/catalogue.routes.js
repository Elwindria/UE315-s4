const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");
const { ObjectId } = require("mongodb");

function isBorrowed(doc) {
  return (doc?.fields?.FIELD9 ?? "") !== "";
}

router.get("/", async (req, res) => {
  const db = await connectDB();

  const q = (req.query.q || "").trim();

  // page (>=1) + limit fixe à 10
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = q
    ? {
        $or: [
          { "fields.titre_avec_lien_vers_le_catalogue": { $regex: q, $options: "i" } },
          { "fields.auteur": { $regex: q, $options: "i" } },
          { "fields.type_de_document": { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const collection = db.collection("livre");

  const [documents, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ _id: 1 }) // important pour une pagination stable
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  res.render("catalogue", {
    documents,
    q,
    msg: req.query.msg || "",
    isBorrowed,
    page,
    total,
    totalPages,
    limit,
  });
});

// POST /borrow/:id  -> fields.FIELD9 = "borrowed" 
router.post("/borrow/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("livre");

    const _id = new ObjectId(req.params.id);

    const result = await collection.updateOne(
      { _id, $or: [{ "fields.FIELD9": "" }, { "fields.FIELD9": { $exists: false } }, { "fields.FIELD9": null }] },
      { $set: { "fields.FIELD9": "borrowed" } }
    );

    res.redirect(result.modifiedCount === 1 ? "/?msg=borrowed" : "/?msg=already");
  } catch (err) {
    console.error("Borrow error:", err);
    res.redirect("/?msg=error");
  }
});

// POST /return/:id -> fields.FIELD9 = ""
router.post("/return/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("livre");

    const _id = new ObjectId(req.params.id);

    const result = await collection.updateOne(
      { _id },
      { $set: { "fields.FIELD9": "" } }
    );

    res.redirect(result.modifiedCount === 1 ? "/?msg=returned" : "/?msg=already");
  } catch (err) {
    console.error("Return error:", err);
    res.redirect("/?msg=error");
  }
});

module.exports = router;