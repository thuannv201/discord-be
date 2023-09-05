import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../logger";

dotenv.config();
const USERNAME = process.env.USERNAME || "";
const PASSWORD = process.env.PASSWORD || "";
const CLUSTER = process.env.CLUSTER || "";
const DB_NAME = process.env.DB_NAME || "";

const MONGO_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT || 5000;

async function connect() {
    try {
        await mongoose.connect(MONGO_URL);
        logger.info("connect successfully");
    } catch (e) {
        logger.error("connect failure", e);
    }
}

export default connect;
