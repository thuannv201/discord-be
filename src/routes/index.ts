import { checkValidToken } from "../middleware";
import { Express } from "express";
import authRouter from "./auth";
const routes = (app: Express) => {
    app.use("/auth", authRouter);
};

export { routes };
