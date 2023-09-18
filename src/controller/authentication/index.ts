import { Request, Response } from "express";

import AuthServices from "@services/auth";

class AuthController {
    async login(req: Request, res: Response) {
        await AuthServices.login(req, res);
    }

    async register(req: Request, res: Response) {
        await AuthServices.register(req, res);
    }

    async refreshToken(req: Request, res: Response) {
        await AuthServices.refreshToken(req, res);
    }

    async forgotPw(req: Request, res: Response) {
        await AuthServices.forgotPw(req, res);
    }

    async resetPw(req: Request, res: Response) {
        await AuthServices.resetPw(req, res);
    }
}

export default new AuthController();
