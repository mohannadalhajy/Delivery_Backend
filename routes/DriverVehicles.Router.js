const express = require("express");
const router = express.Router();
const controller = require("../controllers/DriverVehicles.Controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");

//Get a list of all KeyWords
router.post("/", verifyAccessToken, controller.add);
router.get("/drivers", verifyAccessToken, controller.getDrivers);
router.get("/vehicles", verifyAccessToken, controller.getVehicles);
router.get("/transactions", verifyAccessToken, controller.getTransactions);
router.get("/releaseDriver/:id", verifyAccessToken, controller.releaseDriver);
router.get("/releaseVehicle/:id", verifyAccessToken, controller.releaseVehicle);

module.exports = router;