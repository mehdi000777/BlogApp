import express, { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { validateEmail, validatePhone, validRegister } from '../middleware/validate';
import { createAccessToken, createActivateToken, createRefreshToken } from '../config/genrateTokens';
import sendMail from '../config/sendEmail';
import { sendOTP, sendSms, smsVerify } from '../config/sendSMS';
import jwt from 'jsonwebtoken';
import { IDecodeToken, IGLPayload, IReqAuth, IUser, IUserParams } from '../config/interface';
import { OAuth2Client } from 'google-auth-library';
import { auth } from '../middleware/auth';


const authRouter = express.Router();


//REGISTER USER
authRouter.post("/register", validRegister, async (req: Request, res: Response) => {
    const BASE_URL = `${process.env.BASE_CLIENT_URL}`;

    try {
        const { name, account, password } = req.body;

        const user = await User.findOne({ account });
        if (user) return res.status(400).send({ msg: "Email or phone number already exist." });

        const passwordHash = bcrypt.hashSync(password, 12);

        const newUser = {
            name,
            account,
            password: passwordHash
        }

        const activate_token = createActivateToken({ newUser });

        const url = `${BASE_URL}/active/${activate_token}`;

        if (validateEmail(account)) {
            sendMail(account, url, "Verify your email adderss");
            return res.send({ msg: "Success!Please check your email." });

        } else if (validatePhone(account)) {
            sendSms(account, url, "Verify your phone number");
            return res.send({ msg: "Success!Please check your phone." });
        }

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//SEND EMAIL AND ACTIVE ACCOUNT
authRouter.post("/activateAccount", async (req: Request, res: Response) => {
    try {
        const { active_token } = req.body;

        if (!active_token) return res.status(400).send({ msg: "Email or phone number is not exist." });

        const decode = <IDecodeToken>jwt.verify(active_token, `${process.env.ACTIVATE_TOKEN_SECRET}`);

        const { newUser } = decode;

        if (!newUser) return res.status(400).send({ msg: "Invalid authentication." });

        const user = await User.findOne({ account: newUser.account });
        if (user) return res.status(400).send({ msg: "This account already exist." });

        const InsertUser = new User(newUser);

        await InsertUser.save();

        res.send({
            msg: "Account has been activated!",
        })

    } catch (err: any) {
        let errMsg;

        if (err.code === 11000) {
            errMsg = Object.keys(err.keyValue)[0] + " already exist.";
        }
        else {
            console.log(err);
            let name = Object.keys(err.errors)[0];
            errMsg = err.errors[`${name}`].message;
        }

        res.status(500).send({ msg: errMsg });
    }
})


//LOGIN USER
authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { account, password } = req.body;

        const user = await User.findOne({ account });
        if (!user) return res.status(400).send({ msg: "This account does not exist." });

        loginUser(user, password, res);

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//LOGOUT USER
authRouter.post("/logout", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication." });

    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            path: `/api/refresh_token`,
        });

        await User.findOneAndUpdate({ _id: req.user._id }, {
            rf_token: ""
        })

        res.send({ msg: "Logged out!" });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//STAY LOGIN USER
authRouter.get("/refresh_token", async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) return res.status(400).send({ msg: "Please login now." });

        const decode = <IDecodeToken>jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
        if (!decode.id) return res.status(400).send({ msg: "Please login now." });

        const user = await User.findById(decode.id).select("-password +rf_token");
        if (!user) return res.status(400).send({ msg: "This user does not exist." });

        if (refreshToken !== user.rf_token) return res.status(400).send({ msg: "Please login now." });

        const access_token = createAccessToken({ id: user._id });
        const refresh_token = createRefreshToken({ id: user._id }, res);

        await User.findOneAndUpdate({ _id: user._id }, {
            rf_token: refresh_token
        });

        res.send({
            access_token,
            user
        })

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//LOGIN WITH GOOGLE
authRouter.post("/google_login", async (req: Request, res: Response) => {
    try {
        const { id_token } = req.body;
        const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);

        const verify = await client.verifyIdToken({
            idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
        });

        const { email, email_verified, name, picture } = <IGLPayload>verify.getPayload();

        if (!email_verified) return res.status(400).send({ msg: "Email verification faild." });

        const password = email + "6]SaMnF}A>w8q{9&Z/>&4C=%!@p$D(>vDx5<:Q6MjjTd3t_*em(xN~s";
        const passwordHash = bcrypt.hashSync(password, 12);

        const user = await User.findOne({ account: email });

        if (user) {
            loginUser(user, password, res);
        }
        else {
            const user = {
                account: email,
                name,
                avatar: picture,
                password: passwordHash,
                type: "google"
            };

            registerUser(user, res);
        }

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//SEND SMS FOR LOGIN
authRouter.post("/login_sms", async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;

        const data = await sendOTP(phone, "sms");

        res.send(data);
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//VERIFY SMS AND LOGIN OR CREATE ACCOUNT
authRouter.post("/sms_verify", async (req: Request, res: Response) => {
    try {
        const { phone, code } = req.body;

        const data = await smsVerify(phone, code);
        if (!data?.valid) return res.status(400).send({ msg: "Invalid Authentication." });

        const password = phone + "v;zun$@mS4}}.9.CrycUv+wj433>W}4SXG7;SVVRfb'5s<`5>2e5_Y(v";
        const passwordHash = bcrypt.hashSync(password, 12);

        const user = await User.findOne({ account: phone });

        if (user) {
            loginUser(user, password, res);
        }
        else {
            const user = {
                account: phone,
                name: phone,
                password: passwordHash,
                type: "sms"
            };

            registerUser(user, res);
        }

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//Forget Password
authRouter.post("/forget_password", async (req: Request, res: Response) => {
    const BASE_URL = `${process.env.BASE_CLIENT_URL}`;

    try {
        const { account } = req.body;
        if (!account) return res.status(400).send({ msg: "Please enter your password." });

        const user = await User.findOne({ account });
        if (!user) return res.status(400).send({ msg: "This account does not exist." });

        if (user.type !== "register")
            return res.status(400).send({ msg: `Quick login account with ${user.type} can't use this function.` });

        const access_token = createAccessToken({ id: user._id });

        const url = `${BASE_URL}/reset_password/${access_token}`;

        if (validateEmail(account)) {
            sendMail(account, url, "Forget Password?");
            res.send({msg:"Success! please check your email"});
        }
        else if (validatePhone(account)) {
            sendSms(account, url, "Forget Password?");
            res.send({msg:"Success! please check your phone"});
        }

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})




const loginUser = async (user: IUser, password: string, res: Response) => {
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        let msgErr = user.type === "register"
            ? "Password is inccorect."
            : `Password is inccorect. This account login with ${user.type}`

        return res.status(400).send({ msg: msgErr });
    }

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id }, res);

    await User.findOneAndUpdate({ _id: user._id }, {
        rf_token: refresh_token
    })

    res.send({
        msg: "Login success!",
        user: {
            ...user._doc,
            password: ""
        },
        access_token
    });
}

const registerUser = async (user: IUserParams, res: Response) => {
    const newUser = new User(user)

    const access_token = createAccessToken({ id: newUser._id });
    const refresh_token = createRefreshToken({ id: newUser._id }, res);

    newUser.rf_token = refresh_token;

    await newUser.save();

    res.send({
        msg: "Register success!",
        user: {
            ...newUser._doc,
            password: ""
        },
        access_token
    });
}

export default authRouter;