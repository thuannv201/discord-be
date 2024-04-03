import { Express } from "express";
import authRouter from "./auth";
import friendRouter from "./friends";
const routes = (app: Express) => {
    app.use("/auth", authRouter);
    app.use("/friend", friendRouter);
};

export { routes };
