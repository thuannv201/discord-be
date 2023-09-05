import express from "express";
import PesonalControllers from "../../controller/user/PersonalController";
const router = express.Router();
const personal = new PesonalControllers();
router.get("/friends", personal.getListFriend);
router.get("/requestReceived", personal.getReceivedListRequest);
router.get("/requestOwn", personal.getOwnListRequest);
router.get("/listDM", personal.getListDirectMessage);
// router.get("/listSpecialUsers", personal.getListSpecialUsers);
router.get("/", personal.getPersonalData);

export default router;
