require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./db/mongo");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}

start();