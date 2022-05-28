const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Drivers/Profile.Controller");
const { verifyAccessToken } = require("../../helpers/jwt_helper");

//Get a list of all KeyWords
router.get("/profileMe", verifyAccessToken, controller.profileMe);
router.post("/updatePassword", verifyAccessToken, controller.updatePassword);
router.post("/location", verifyAccessToken, controller.updateLocation);
router.post("/status", verifyAccessToken, controller.updateStatus);
router.patch("/token", verifyAccessToken, controller.updateFirebaseToken);
router.post("/updateEmail", verifyAccessToken, controller.updateEmail);

module.exports = router;