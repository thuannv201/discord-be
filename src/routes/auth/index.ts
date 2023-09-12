import express from "express";
import AuthController from "@controller/authentication";
import { validateUsername, verifyTokenResetPw } from "@middleware/index";

const router = express.Router();

// router.post("/forgotPassword", AuthController.forgotPW);
// router.get("/test", AuthController.test);
// router.post("/refresh-token", AuthController.refreshToken);
router.post("/login", AuthController.resolveLogin);
router.post("/register", validateUsername, AuthController.register);
// router.post("/reset", verifyTokenResetPw, AuthController.resetPW);

export default router;
