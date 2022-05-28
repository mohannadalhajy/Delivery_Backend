const express = require("express");
const router = express.Router();
const controller = require("../controllers/Vehicles.Controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");


router.post("/", verifyAccessToken, controller.add);
router.get("/", verifyAccessToken, controller.getAll);
router.get("/numbers", verifyAccessToken, controller.getNumbers);
router.get("/busyNumbers", verifyAccessToken, controller.getBusyNumbers);
router.get("/freeNumbers", verifyAccessToken, controller.getFreeNumbers);
router.delete("/deleteAll", verifyAccessToken, controller.deleteAll);
router.post("/deleteGroup", verifyAccessToken, controller.deleteGroup);
router.delete("/:id", verifyAccessToken, controller.delete);
router.patch("/:id", verifyAccessToken, controller.update);
router.get("/:id", verifyAccessToken, controller.findById);
module.exports = router;