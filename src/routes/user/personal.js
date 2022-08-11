const express = require("express");
const PesonalControllers = require("../../controller/user/personal");
const router = express.Router();
router.get("/special", PesonalControllers.getListSpecialUsers);
router.get("/requestReceived", PesonalControllers.getReceivedListRequest);
router.get("/requestOwn", PesonalControllers.getOwnListRequest);
router.get("/listSpecialUsers", PesonalControllers.getListSpecialUsers);
router.get("/", PesonalControllers.getPersonalData);

module.exports = router;
