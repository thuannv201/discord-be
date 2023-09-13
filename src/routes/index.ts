import { checkValidToken } from "../middleware";
import { Express } from "express";
import authRouter from "./auth";
import conversationRouter from "./conversation/conversation";
import personalRouter from "./user/personal";
const routes = (app: Express) => {
    app.use("/auth", authRouter);
    app.use("/channel", conversationRouter);
    app.use("/personal", checkValidToken, personalRouter);
};

export { routes };
