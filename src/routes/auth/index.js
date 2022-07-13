const express = require("express");
const authController = require("../../controller/authen");
const {verifyToken, verifyUser, validateUsername} = require("../../middleware");
const router = express.Router();
router.post("/forgotPassword", authController.forgotPW);
router.get("/test", verifyToken, authController.test);
router.post("/login", verifyUser, authController.resolveLogin);
router.post("/refreshToken", authController.refreshToken);
router.post("/register", validateUsername, authController.register);

module.exports = router;
