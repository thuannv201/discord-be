import { Request, Response } from "express";

import AuthServices from "@services/auth";
import LoginService from "@services/auth/loginService";
import RegisterService from "@services/auth/registerService";

export const login = async (req: Request, res: Response) => {
    await LoginService.execute(req, res);
};

export const register = async (req: Request, res: Response) => {
    await RegisterService.execute(req, res);
};

export const refreshToken = async (req: Request, res: Response) => {
    await AuthServices.refreshToken(req, res);
};

export const forgotPw = async (req: Request, res: Response) => {
    await AuthServices.forgotPw(req, res);
};

export const resetPw = async (req: Request, res: Response) => {
    await AuthServices.resetPw(req, res);
};
