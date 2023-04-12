const express = require("express");
const mongoose = require("mongoose");
const app = express();

var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
var myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const path = require("path");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
app.use(express.json());

mongoose.connect(process.env.MONGODB_LINK,
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
app.use("/images", express.static(path.join(__dirname, 'images')));

module.exports = app;