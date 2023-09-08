import express from "express";
import PesonalControllers from "../../controller/user";
const router = express.Router();
router.get("/friends", PesonalControllers.getListFriend);
router.get("/requestReceived", PesonalControllers.getReceivedListRequest);
router.get("/requestOwn", PesonalControllers.getOwnListRequest);
router.get("/listDM", PesonalControllers.getListDirectMessage);
// router.get("/listSpecialUsers", PesonalControllers.getListSpecialUsers);
router.get("/", PesonalControllers.getPersonalData);

export default router;
