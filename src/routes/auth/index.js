const express = require("express");
const authController = require("../../controller/authen");
const {verifyToken, verifyUser} = require("../../middleware");
const router = express.Router();

router.get("/test", verifyToken, authController.test);
router.post("/login",verifyUser, authController.resolveLogin);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
