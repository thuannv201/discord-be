import { Request, Response } from "express";
import loginService from "@services/auth/loginService";
import registerService from "@services/auth/registerService";
import refreshTokenService from "@services/auth/refreshTokenService";
import forgotPwService from "@services/auth/forgotPwService";
import resetPwService from "@services/auth/resetPwService";

export const login = async (req: Request, res: Response) => {
    await loginService.execute(req, res);
};

export const register = async (req: Request, res: Response) => {
    await registerService.execute(req, res);
};

export const refreshToken = async (req: Request, res: Response) => {
    await refreshTokenService.execute(req, res);
};

export const forgotPw = async (req: Request, res: Response) => {
    await forgotPwService.execute(req, res);
};

export const resetPw = async (req: Request, res: Response) => {
    await resetPwService.execute(req, res);
};
