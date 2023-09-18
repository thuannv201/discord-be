import { Request, Response } from "express";

import AuthServices from "@services/auth";

class AuthController {
    async login(req: Request, res: Response) {
        await AuthServices.loginService(req, res);
    }

    async register(req: Request, res: Response) {
        await AuthServices.registerService(req, res);
    }

    async refreshToken(req: Request, res: Response) {
        await AuthServices.refreshTokenService(req, res);
    }

    async forgotPw(req: Request, res: Response) {
        await AuthServices.forgotPwService(req, res);
    }

    async resetPw(req: Request, res: Response) {
        await AuthServices.resetPwService(req, res);
    }
}

export default new AuthController();
