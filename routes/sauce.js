const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// TODO -- Penser à intégrer multer aux routes POST et PUT
router.get("/", sauceCtrl.getAllSauces)


module.exports = router;