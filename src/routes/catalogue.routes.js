const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");
const { ObjectId } = require("mongodb");

function isBorrowed(doc) {
  return (doc?.fields?.FIELD9 ?? "") !== "";
}

router.get("/", async (req, res) => {
  const db = await connectDB();
  const documents = await db
    .collection("livre")
    .find({})
    .limit(10)
    .toArray();

  res.render("catalogue", {
  documents,
  q: req.query.q || "",
  msg: req.query.msg || "",
  isBorrowed
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


});

module.exports = router;