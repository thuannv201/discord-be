import "module-alias/register.js";
import express, { Express } from "express";
import { routes } from "./routes";
import cors from "cors";
import logger from "./logger";
import connectDb from "./config/config";
import { SocketData } from "payload/SocketIoPayload";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5508;
const app: Express = express();
const httpServer = createServer(app);

app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,*",
    }),
    express.json(),
    express.urlencoded({ extended: true })
).options("*", cors());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/chat.html");
});
routes(app);

const io = new Server(httpServer);
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});

httpServer.listen(PORT, async () => {
    await connectDb();
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
