const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Drivers/Orders.Controller");
const multer = require("multer");
const path = require('path');
const { verifyAccessToken } = require("../../helpers/jwt_helper");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }  
});  
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
//Get a list of all KeyWords
router.get("/accept/:id", verifyAccessToken, controller.acceptOrder);
router.get("/pickUp/:id", verifyAccessToken, controller.pickUpOrder);
router.post("/reject", verifyAccessToken, controller.rejectOrder);
router.post("/edit", verifyAccessToken, controller.editOrder);
router.post("/failed", verifyAccessToken, controller.failedOrder);
router.post("/deliver", verifyAccessToken, controller.deliverOrder);
router.get("/:id", verifyAccessToken, controller.findById);
module.exports = router;