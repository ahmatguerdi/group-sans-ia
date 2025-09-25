require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;

const authRoutes = require("./routers/userRoute")

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conneté avec succès!");
  })
  .catch((error) => {
    console.error("Erreur de connexion!:", error);
  });

  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.listen(PORT, () => {
    console.log(`Serveur est démarré sur le http://localhost: ${PORT}`);
    
  })
