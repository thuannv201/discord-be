import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { comparePassword, sendFailMessage } from "@utils/index";
import {
    FindHashPasswordByUserId,
    FindUserByEmail,
} from "@services/auth/AuthService";

dotenv.config();

const ACCESS_TOKEN_JWT_KEY = process.env.ACCESS_TOKEN_JWT_KEY || "";
const FPW_TOKEN_JWT_KEY = process.env.FPW_TOKEN_JWT_KEY || "";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")?.[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_JWT_KEY);
        req.body = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

function validateUsername(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const iUsernameValid = usernameRegex.test(username);
    if (!iUsernameValid)
        res.status(201).send(sendFailMessage("Username is not valid !"));
    if (iUsernameValid) next();
}

function verifyTokenResetPw(req: Request, res: Response, next: NextFunction) {
    const received = req.body;
    const token = received.token;
    if (!token) res.status(401).send(sendFailMessage("Token invalid"));
    jwt.verify(token, FPW_TOKEN_JWT_KEY, (err: any, data: any) => {
        if (err) {
            console.log("err :", err);
            res.status(201).send(sendFailMessage("Token invalid!", err));
        }
        if (data) {
            console.log("data :", data);
            res.locals.username = data.username;
            next();
        }
    });
}

export { verifyToken, validateUsername, verifyTokenResetPw };
