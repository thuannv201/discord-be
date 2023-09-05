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

const PORT = process.env.PORT || 1280;
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

io.on("connection", (socket) => {
    socket.on(
        "chat_message",
        (content, attachments, conversationId, authorId) => {
            if (conversationId) {
                console.log("conversationId", conversationId);
            }
        }
    );

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("receive_request_friend", (requestor) => {
        console.log("requestor :", requestor);
    });

    socket.on("send_request_friend", (requestor, to) => {});

    socket.on("accept_request_user", (requestor, to) => {
        Promise.all([]).then((values) => {
            socket.to(to).to(requestor).emit("request_accepted");
        });
    });
});

// start our server

app.listen(PORT, () => {
    logger.info(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
