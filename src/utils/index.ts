import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    ACCESS_TOKEN_JWT_KEY,
    EXPIRES_TIME_REFRESH_TOKEN,
    EXPIRES_TIME_TOKEN,
    FPW_TOKEN_JWT_KEY,
    REFRESH_TOKEN_JWT_KEY,
} from "./contants";

export function sendFailMessage(
    message: string = "",
    other: any = {},
    status: number | null = null,
    documentName: string = "element"
) {
    switch (status) {
        case null:
            return Object.assign(
                {
                    status: "fail",
                    message: message,
                },
                other
            );
        case 11000:
            return Object.assign(
                {
                    status: "fail",
                    message: message,
                    error: `${documentName} already exist`,
                },
                other
            );
    }
}

export function sendSuccessMessage(message: string = "", other: any = {}) {
    return Object.assign(
        {
            status: "success",
            message: message,
        },
        other
    );
}

export async function hashPassword(plaintext_password: string) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(plaintext_password, saltRounds, function (err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });

    return hashedPassword;
}

export const comparePassword = async (
    plaintext_password: string,
    hash_password: string
) => {
    const isCorrect = await new Promise((resolve) => {
        bcrypt.compare(
            plaintext_password,
            hash_password,
            function (err, result) {
                resolve(result);
            }
        );
    });
    return isCorrect;
};

export const signAccessToken = (data: object) => {
    return jwt.sign(data, ACCESS_TOKEN_JWT_KEY, {
        expiresIn: EXPIRES_TIME_TOKEN,
    });
};

export const signRefreshToken = (data: object) => {
    return jwt.sign(data, REFRESH_TOKEN_JWT_KEY, {
        expiresIn: EXPIRES_TIME_REFRESH_TOKEN,
    });
};

export const signRsPwToken = (data: object) => {
    return jwt.sign(data, FPW_TOKEN_JWT_KEY, {
        expiresIn: "10m",
    });
};

export const verifyRefreshToken = (resfresh_token: string) => {
    return jwt.verify(resfresh_token, REFRESH_TOKEN_JWT_KEY);
};

export const verifyAccessToken = (access_token: string) => {
    return jwt.verify(access_token, ACCESS_TOKEN_JWT_KEY);
};

export const verifyRsPwToken = (rspw_token: string) => {
    return jwt.verify(rspw_token, FPW_TOKEN_JWT_KEY);
};
