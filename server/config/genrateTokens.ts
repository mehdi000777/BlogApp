import jwt from "jsonwebtoken";
import { Response } from "express";


export const createActivateToken = (payload: object) => {
    return jwt.sign(payload, `${process.env.ACTIVATE_TOKEN_SECRET}`, { expiresIn: "5m" });
}

export const createAccessToken = (payload: object) => {
    return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: "15m" });
}

export const createRefreshToken = (payload: object, res: Response) => {
    const refresh_token = jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: "30d" });

    res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
    })

    return refresh_token;
}