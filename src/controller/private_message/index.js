const {sendSuccessMessage, sendFailMessage} = require("../../utils");
const Conversation = require("../../models/conversations/conversation");
const Message = require("../../models/conversations/messages");

class ConversationController {
  createConversation(req, res) {
    const received = req.body;
    Conversation.findOne({recipients: {$all: [...received?.recipientIds]}})
      .then((data) => {
        if (data) {
          res.send(
            sendSuccessMessage("success find", {
              ...data._doc,
              id: data._doc._id,
            })
          );
        } else {
          Conversation.create({recipients: [...received?.recipientIds]})
            .then((data) => {
              res.send(
                sendSuccessMessage("success create", {
                  ...data._doc,
                  id: data._doc._id,
                })
              );
            })
            .catch((err) => {
              res.send(sendFailMessage("fails create", err));
            });
        }
      })
      .catch((e) => {
        res.send(sendFailMessage("failed occurred", e));
      });
  }
}

module.exports = new ConversationController();
