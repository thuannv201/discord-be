import dotenv from "dotenv";
dotenv.config();

export const EXPIRES_TIME_TOKEN = "7days";
export const EXPIRES_TIME_REFRESH_TOKEN = "7days";
export const ACCESS_TOKEN_JWT_KEY = process.env.ACCESS_TOKEN_JWT_KEY || "";
export const REFRESH_TOKEN_JWT_KEY = process.env.REFRESH_TOKEN_JWT_KEY || "";
export const FPW_TOKEN_JWT_KEY = process.env.FPW_TOKEN_JWT_KEY || "";
