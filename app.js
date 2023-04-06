const express = require("express");
const mongoose = require("mongoose");
const app = express();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
app.use(express.json());

// TODO Intégrer les variables d'environnement pour ne pas utiliser mes infos.
// TODO --> installer dotenv (npm) : https://www.npmjs.com/package/dotenv
mongoose.connect('mongodb+srv://Martin_Evrard:s8JtYhSjc31N6oGu@clusterexp6.rmmzyae.mongodb.net/Hot-Takes_OCP6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;