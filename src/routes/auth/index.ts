import express from "express";
import authController from "@controller/authentication";
import {
    verifyToken,
    verifyUser,
    validateUsername,
    verifyTokenResetPw,
} from "../../middleware";
const router = express.Router();
router.post("/forgotPassword", authController.forgotPW);
router.get("/test", authController.test);
router.post("/login", verifyUser, authController.resolveLogin);
router.post("/refreshToken", authController.refresh);
router.post("/register", validateUsername, authController.register);
router.post("/reset", verifyTokenResetPw, authController.reset);

export default router;
