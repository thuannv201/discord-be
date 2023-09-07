import dotenv from "dotenv";
dotenv.config();

export const saltRounds = 10;
export const EXPIRES_TIME_TOKEN = "10m";
export const EXPIRES_TIME_REFRESH_TOKEN = "30m";
export const ACCESS_TOKEN_JWT_KEY = process.env.ACCESS_TOKEN_JWT_KEY || "";
export const REFRESH_TOKEN_JWT_KEY = process.env.REFRESH_TOKEN_JWT_KEY || "";
export const FPW_TOKEN_JWT_KEY = process.env.FPW_TOKEN_JWT_KEY || "";
