const express = require("express");
const db = require("./config");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const Message = require("./models/conversations/messages");
const UserSpecial = require("./models/user/userSpecial");
const UserRequest = require("./models/user/requestUser");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
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
  socket.on(
    "chat message",
    (content, attachments, conversationId, authorId) => {
      if (conversationId) {
        console.log("conversationId", conversationId);
        Message.create({
          author: authorId,
          conversationId: conversationId,
          content: content,
          attachments: attachments,
        }).then((data) => {
          console.log(data);
          socket
            .to(conversationId)
            .emit(
              "chat message",
              content,
              attachments,
              conversationId,
              authorId
            );
        });
      }
    }
  );
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("receive_request_friend", (requestor) => {
    console.log("requestor :", requestor);
  });

  socket.on("send_request_friend", (requestor, to) => {
    UserRequest.create({requestor: requestor?.id, to: to}).then((data) => {
      socket.to(to).emit("receive_request_friend", requestor);
    });
  });

  socket.on("accept_request_user", (requestor, to) => {
    Promise.all([
      UserSpecial.findOne({owner: to}).then((data) => {
        if (data) {
          UserSpecial.findOneAndUpdate(
            {owner: to},
            {$push: {specialList: {role: "friend", id: requestor}}}
          );
        } else {
          UserSpecial.create({
            owner: to,
            specialList: [{role: "friend", id: requestor}],
          });
        }
      }),
      UserSpecial.findOne({owner: requestor}).then((data) => {
        if (data) {
          UserSpecial.findOneAndUpdate(
            {owner: requestor},
            {$push: {specialList: {role: "friend", id: to}}}
          );
        } else {
          UserSpecial.create({
            owner: requestor,
            specialList: [{role: "friend", id: to}],
          });
        }
      }),
    ]).then((values) => {
      socket.to(to).to(requestor).emit("request_accepted");
    });
  });
});

// app.listen(PORT, "0.0.0.0", () => {
//   console.log("listening on localhost:4508");
// });

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
