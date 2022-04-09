const express = require("express");
const router = express.Router();
const controller = require("../controllers/Clients.Controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/", verifyAccessToken, controller.add);
router.get("/", controller.getAll);
router.delete("/:id", verifyAccessToken, controller.delete);
router.patch("/:id", verifyAccessToken, controller.update);
router.get("/:id", verifyAccessToken, controller.findById);
module.exports = router;