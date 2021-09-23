import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IDecodeToken, IReqAuth } from '../config/interface';
import User from '../models/userModel';


export const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(400).send({ msg: "Invalid Authentication." });

        const decode = <IDecodeToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
        if (!decode) return res.status(400).send({ msg: "Invalid Authentication." });

        const user = await User.findOne({ _id: decode.id });
        if (!user) return res.status(400).send({ msg: "User does not exist." });

        req.user = user;
        next();

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
}


export const adminAuth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication." });

    try {
        if (req.user.role !== "admin")
            return res.status(400).send({ msg: "Invalid Authentication." });

        next();

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
}