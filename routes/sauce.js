const express = require("express");
const sauceCtrl = require("../controllers/sauce");

const router = express.Router();

router.get("/", sauceCtrl.getAllSauces)

module.exports = router;