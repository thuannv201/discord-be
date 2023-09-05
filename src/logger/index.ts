import winston from "winston";

const { timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize(),
        label({ label: "logger" }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});

export default logger;
