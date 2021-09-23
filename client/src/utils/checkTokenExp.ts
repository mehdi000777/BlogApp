import axios from "axios";
import jwt_decode from "jwt-decode";
import { authTypes } from "../redux/types/authTypes";

interface IToken {
    exp: number
    iat: number
    id: string

}

export const checkTokenExp = async (token: string, dispatch: any) => {
    const decoded: IToken = jwt_decode(token);

    if (decoded.exp >= Date.now() / 1000) return;

    const res = await axios("/api/refresh_token", {
        method: "get"
    })

    dispatch({
        type: authTypes.AUTH,
        payload: {
            user: res.data.user,
            token: res.data.access_token
        }
    });
    return res.data.access_token;
}