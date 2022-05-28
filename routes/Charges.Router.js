const express = require("express");
const router = express.Router();
const controller = require("../controllers/Charges.Controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");
//Get a list of all KeyWords
router.post("/", verifyAccessToken, controller.add);
router.get("/", verifyAccessToken, controller.getAll);
router.delete("/:id", verifyAccessToken, controller.delete);
router.patch("/:id", verifyAccessToken, controller.update);
router.get("/:id", verifyAccessToken, controller.findById);
module.exports = router;