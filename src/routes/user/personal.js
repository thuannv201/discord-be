const express = require("express");
const PesonalControllers = require("../../controller/user/personal");
const router = express.Router();
router.get("/friends", PesonalControllers.getListFriend);
router.get("/requestReceived", PesonalControllers.getReceivedListRequest);
router.get("/requestOwn", PesonalControllers.getOwnListRequest);
router.get("/", PesonalControllers.getPersonalData);

module.exports = router;
