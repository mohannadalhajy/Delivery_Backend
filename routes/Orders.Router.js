const express = require("express");
const router = express.Router();
const controller = require("../controllers/Orders.Controller");
const multer = require("multer");
const path = require('path');
const { verifyAccessToken } = require("../helpers/jwt_helper");
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
router.post("/", verifyAccessToken, controller.add);
router.get("/", verifyAccessToken, controller.getAll);
router.delete("/:id", verifyAccessToken, controller.delete);
router.patch("/:id", verifyAccessToken, controller.update);
router.get("/:id", verifyAccessToken, controller.findById);
module.exports = router;