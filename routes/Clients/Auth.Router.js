const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Clients/Auth.Controller");
const { verifyAccessToken } = require("../../helpers/jwt_helper");

//Get a list of all KeyWords
router.post("/login", controller.login);
router.post("/logout",verifyAccessToken,  controller.logout);

module.exports = router;