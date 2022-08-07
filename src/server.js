const express = require("express");
const db = require("./config");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
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
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const PORT = process.env.PORT || 4508;
db.connect();
routes(app);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg, room) => {
    if (room) {
      console.log("room", room);
      socket.to(room).emit("chat message", msg);
    }
  });
  socket.on("join-room", (room) => {
    socket.join(room);
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("listening on localhost:4508");
});

http.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});

/*
  chat:1v1 => ấn vào người dùng gửi => id người nhận => tạo 1 conversation room  => channels_id =>
  gửi tin nhắn đi thì bên kia nhận được conversation id
  khi tìm đoạn hội thoại 2 người thì: nếu chưa tạo bh => tạo
                                      nếu tạo rồi thì tìm id recipients [có trong mảng là ok]

  {
    id:objId,
    recipients:[objId],
    messages:[{author:string, content:string, }]
  }
 */
