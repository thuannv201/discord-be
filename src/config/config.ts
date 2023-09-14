import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../logger";

dotenv.config();

const MONGO_URL = `mongodb+srv://hochv2001:hoc17112001@discordcluster.v5xnmd6.mongodb.net/discord-db?retryWrites=true&w=majority`;

async function connectDb() {
    try {
        await mongoose.connect(MONGO_URL);
        logger.info("Connect MonggoAtlas Cloud successfully");
    } catch (e) {
        logger.error("Connect MonggoAtlas Cloud failure", e);
    }
}

export default connectDb;
