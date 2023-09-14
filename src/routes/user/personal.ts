import express from "express";
import PesonalControllers from "../../controller/user";
const router = express.Router();
router.get("/", PesonalControllers.getPersonalData);

export default router;
