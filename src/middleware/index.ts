import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
    sendFailMessage,
    verifyAccessToken,
    verifyRsPwToken,
} from "@utils/index";

const checkValidToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")?.[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = verifyAccessToken(token);
        req.body = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

function checkValidUserName(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const iUsernameValid = usernameRegex.test(username);
    if (!iUsernameValid)
        res.status(400).send(sendFailMessage("Username is not valid !"));
    if (iUsernameValid) next();
}

function checkTokenResetPw(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body;
    if (!token)
        res.status(401).send(
            sendFailMessage("The link has been invalid or expired!")
        );
    try {
        const data = verifyRsPwToken(token) as JwtPayload;
        console.log("data :", data);
        res.locals.user_email = data.user_email;
        next();
    } catch (err) {
        console.log("err :", err);
        res.status(201).send(
            sendFailMessage("The link has been invalid or expired!", err)
        );
    }
}

export { checkValidToken, checkValidUserName, checkTokenResetPw };
