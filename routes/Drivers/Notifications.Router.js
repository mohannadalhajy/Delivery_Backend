const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Drivers/Notifiction.Controller");
const { verifyAccessToken } = require("../../helpers/jwt_helper");

//Get a list of all KeyWords
router.get("/", verifyAccessToken, controller.getAll);
module.exports = router;