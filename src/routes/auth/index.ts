import express from "express";
import AuthController from "@controller/authentication";
import { checkTokenResetPw, checkValidUserName } from "@middleware/index";

const router = express.Router();

router.post("/forgot-password", AuthController.forgotPw);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/login", AuthController.login);
router.post("/register", checkValidUserName, AuthController.register);
router.post("/reset-pw", checkTokenResetPw, AuthController.resetPw);

export default router;
