import { Schema, model, Types } from "mongoose";

export interface IDirectMessages {
    user: Types.ObjectId;
    conversationId: Types.ObjectId;
}

export interface IDirectMessagesModel extends IDirectMessages, Document {}

const DirectMessagesSchema = new Schema<IDirectMessagesModel>(
    {
        user: { type: Schema.Types.ObjectId },
        conversationId: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
);

const DirectMessages = model<IDirectMessagesModel>(
    "DirectMessages",
    DirectMessagesSchema,
    "DirectMessages"
);

export default DirectMessages;