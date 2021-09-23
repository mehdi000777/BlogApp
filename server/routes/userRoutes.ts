import express, { Request, Response } from 'express';
import { IReqAuth } from '../config/interface';
import { auth } from '../middleware/auth';
import User from '../models/userModel';
import bcrypt from 'bcrypt';


const userRouter = express.Router();


//UPDATE PROFILE
userRouter.patch("/user", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication." });

    try {
        const { name, avatar } = req.body;

        await User.findByIdAndUpdate(req.user._id, {
            name, avatar
        });

        res.send({ msg: "Update Success!" });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//RESET PASSWORD
userRouter.patch("/reset_password", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication." });

    if (req.user.type !== "register")
        return res.status(400).send({
            msg: `Quick login account with ${req.user.type} can't use this function`
        });

    try {
        const { password } = req.body;

        if (password.length < 6)
            return res.status(400).send({ msg: "Password must be at least 6 chars." });

        const passwordHash = bcrypt.hashSync(password, 12);

        await User.findByIdAndUpdate(req.user._id, {
            password: passwordHash
        })

        res.send({ msg: "Reset Password Success!" });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


// User Profile
userRouter.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id

        const user = await User.findOne({ _id: userId }).select("-password");

        res.send(user);

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


export default userRouter;