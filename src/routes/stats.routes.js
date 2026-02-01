const express = require("express");
const router = express.Router();
const { connectDB } = require("../db/mongo");

// Page principale des statistiques (rendu côté serveur)
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("livre");

    // Nombre total de documents
    const totalDocuments = await collection.countDocuments();

    // Nombre de types différents
    const types = await collection.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: [{ $type: "$fields.type_de_document" }, "missing"] }, then: "Non défini (manquant)" },
                { case: { $eq: ["$fields.type_de_document", null] }, then: "Non défini (null)" }
              ],
              default: "$fields.type_de_document"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    const totalTypes = types.length;

    // Total des réservations
    const reservationsResult = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalReservations: { $sum: "$fields.nombre_de_reservations" }
        }
      }
    ]).toArray();
    const totalReservations = reservationsResult[0]?.totalReservations || 0;

    // Documents par type
    const documentsByTypeResult = await collection.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$fields.type_de_document", "Non défini"] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    const documentsByType = documentsByTypeResult.map(item => ({
      type: item._id || "Non défini",
      count: item.count
    }));

    // Réservations par type
    const reservationsByTypeResult = await collection.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$fields.type_de_document", "Non défini"] },
          totalReservations: { $sum: "$fields.nombre_de_reservations" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalReservations: -1 } }
    ]).toArray();
    const reservationsByType = reservationsByTypeResult.map(item => ({
      type: item._id || "Non défini",
      totalReservations: item.totalReservations,
      count: item.count,
      average: item.count > 0 ? (item.totalReservations / item.count).toFixed(2) : 0
    }));

    // Top 10 auteurs
    const topAuthorsResult = await collection.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$fields.auteur", "Non défini"] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    const topAuthors = topAuthorsResult.map(item => ({
      author: item._id || "Non défini",
      count: item.count
    }));

    // Calculer le max pour les barres
    const maxDocCount = Math.max(...documentsByType.map(d => d.count));

    res.render("stats", {
      totalDocuments,
      totalTypes,
      totalReservations,
      documentsByType,
      reservationsByType,
      topAuthors,
      maxDocCount
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    res.status(500).render("stats", { error: "Erreur lors du chargement des statistiques" });
  }
});

module.exports = router;