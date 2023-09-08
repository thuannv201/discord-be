import express from "express";
import AuthController from "@controller/authentication";
import {
    verifyUser,
    validateUsername,
    verifyTokenResetPw,
} from "@middleware/index";

const router = express.Router();

router.post("/forgotPassword", AuthController.forgotPW);
router.get("/test", AuthController.test);
router.post("/refresh-token", AuthController.refresh);
router.post("/login", verifyUser, AuthController.resolveLogin);
router.post("/register", validateUsername, AuthController.register);
router.post("/reset", verifyTokenResetPw, AuthController.reset);

export default router;
