const express = require("express");
const LoginControllers = require("../../controller/login");
const {verifyToken} = require("../../middleware");
const router = express.Router();

router.get("/test", verifyToken, LoginControllers.test);
router.post("/", LoginControllers.postLogin);

module.exports = router;
