import express from "express";
import { getFriends } from "@controller/friend";

const router = express.Router();

router.get("/", getFriends);

export default router;
