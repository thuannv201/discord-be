import { Schema, model, Types, Document } from "mongoose";

export interface IConversationMessage {
    author: Types.ObjectId;
    conversationId: Types.ObjectId;
    content: string;
    attachments: string;
}

export interface IConversationMessageModel extends IConversationMessage, Document {}

const ConversationMessageSchema = new Schema<IConversationMessageModel>(
    {
        author: { type: Schema.Types.ObjectId },
        conversationId: { type: Schema.Types.ObjectId },
        content: { type: String },
        attachments: { type: String },
    },
    { timestamps: true }
);

const ConversationMessage = model<IConversationMessageModel>(
    "conversation_message",
    ConversationMessageSchema,
    "conversation_message"
);

export default ConversationMessage;
