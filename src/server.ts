import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./payload/SocketIoPayload";
const app = express();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

app.use(
  // yarn add cors
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

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

app.get("/", function (req, res) {
  res.send("Hello World");
});
 
app.listen(7777);