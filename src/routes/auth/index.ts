import express from "express";
import {
    forgotPw,
    login,
    refreshToken,
    register,
    resetPw,
} from "@controller/authentication";
import { checkTokenResetPw, checkValidUserName } from "@middleware/index";

const router = express.Router();

router.post("/forgot-password", forgotPw);
router.post("/refresh-token", refreshToken);
router.post("/login", login);
router.post("/register", checkValidUserName, register);
router.post("/reset-pw", checkTokenResetPw, resetPw);

export default router;
