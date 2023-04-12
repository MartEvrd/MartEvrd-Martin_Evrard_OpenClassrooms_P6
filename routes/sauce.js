const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.newSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.opinionSauce);

module.exports = router;