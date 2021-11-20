const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const authorize = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", authorize, multer, sauceCtrl.postSauce);
router.post("/:id/like", authorize, sauceCtrl.definesLikes);
router.put("/:id", authorize, multer, sauceCtrl.updateSauce);
router.delete("/:id", authorize, sauceCtrl.deleteSauce);
router.get("/", authorize, sauceCtrl.getAllSauces);
router.get("/:id", authorize, sauceCtrl.getOneSauce);

module.exports = router;