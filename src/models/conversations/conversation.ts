import { Schema, model, Types } from "mongoose";

export interface IConversation {
    recipients: Types.ObjectId;
}

export interface IConversationModel extends IConversation, Document {}

const ConversationSchema = new Schema<IConversationModel>(
    {
        recipients: [{ type: Schema.Types.ObjectId }],
    },
    { timestamps: true }
);

const Conversation = model("Conversation", ConversationSchema, "Conversation");

export default Conversation;
