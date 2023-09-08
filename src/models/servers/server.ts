import { Schema, model, Types } from "mongoose";

export interface IServer {
    members: Types.ObjectId[];
    cover_image: string;
    description: string;
    icon: string;
    name: string;
    publishers: Types.ObjectId[];
    rooms: Types.ObjectId[];
}

export interface IServerModel extends IServer, Document {}

const ServerSchema = new Schema<IServerModel>(
    {
        members: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        cover_image: { type: String, default: "" },
        description: { type: String, default: "" },
        icon: { type: String, default: "" },
        name: { type: String, default: "" },
        publishers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        rooms: [{ type: Schema.Types.ObjectId }],
    },
    { timestamps: true }
);
const Servers = model<IServerModel>("Servers", ServerSchema, "servers");

export default Servers;
