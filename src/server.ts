import "module-alias/register.js";
import express, { Express } from "express";
import { routes } from "./routes";
import cors from "cors";
import { Server } from "socket.io";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./payload/SocketIoPayload";
import logger from "./logger";
import connectDb from "./config/config";
import client from "@elastic-search/client";

const PORT = process.env.PORT || 5508;
const app: Express = express();
app.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }),
    express.json(),
    express.urlencoded({ extended: true })
).options("*", cors());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/chat.html");
});

routes(app);

// Socket.IO server
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>();

// start our server

app.listen(PORT, async () => {
    // const resp = await client.info();
    // logger.info("Connected to ElasticSearch Cloud Cluster");
    await connectDb();
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
