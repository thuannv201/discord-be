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

const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});
io.on("connection", function (socket: Socket) {
    socket.on("disconnect", function () {
        console.log("disconnected");
    });
    //server lắng nghe dữ liệu từ client
    socket.on("Client-sent-data", function (data: SocketData) {
        console.log("sent");
        //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
        socket.emit("Server-sent-data", data);
    });
});

httpServer.listen(PORT, async () => {
    await connectDb();
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
