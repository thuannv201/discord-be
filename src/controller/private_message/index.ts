import { Request, Response } from "express";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import Conversation from "../../models/conversations/conversation";
import Message from "../../models/conversations/messages";

class ConversationController {
    createConversation(req: Request, res: Response) {
        const received = req.body;
        Conversation.findOne({
            recipients: { $all: [...received?.recipientIds] },
        })
            .then((data) => {
                if (data) {
                    res.send(
                        sendSuccessMessage("success find", {
                            // ...data._doc,
                            // id: data._doc._id,
                        })
                    );
                } else {
                    Conversation.create({
                        recipients: [...received?.recipientIds],
                    })
                        .then((data) => {
                            res.send(
                                sendSuccessMessage("success create", {
                                    // ...data._doc,
                                    // id: data._doc._id,
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

    saveMessage(req: Request, res: Response) {
        const received = req.body;
        Message.create({ ...received }).then((data) => {
            res.send(
                sendSuccessMessage("success saved", {
                    data: data,
                })
            );
        });
    }

    getMessages(req: Request, res: Response) {
        Message.find({ conversationId: req.body?.conversationId }).then(
            (data) => {
                console.log("data", data);
                res.send(
                    sendSuccessMessage("success find", {
                        data: data,
                    })
                );
            }
        );
    }
}

export default new ConversationController();
