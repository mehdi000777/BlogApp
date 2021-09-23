import axios from "axios"
import { Dispatch } from "react"
import { checkTokenExp } from "../../utils/checkTokenExp"
import { checkImage, imageUpload } from "../../utils/imageUpload"
import { checkPassword } from "../../utils/validate"
import { alertTypes, IAlertType } from "../types/alertTypes"
import { authTypes, IAuthType, IAuth } from "../types/authTypes"
import { GET_USER_PROFILE, IUserProfileType } from "../types/userTypes"

export const updateUser = (auth: IAuth, avatar: File, name: string) => {
    return async (dispatch: Dispatch<IAlertType | IAuthType>) => {
        if (!auth.user || !auth.token) return;

        const result = await checkTokenExp(auth.token, dispatch);
        const access_token = result ? result : auth.token;

        let url;
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            if (avatar) {
                const check = checkImage(avatar);
                if (check.length > 0) {
                    return dispatch({ type: alertTypes.ALERT, payload: { errors: check } });
                }

                const image = await imageUpload(avatar);
                url = image.url;
            }

            dispatch({
                type: authTypes.AUTH,
                payload: {
                    token: auth.token,
                    user: {
                        ...auth.user,
                        avatar: url ? url : auth.user.avatar,
                        name: name ? name : auth.user.name
                    }
                }
            });

            const res = await axios("/api/user", {
                method: "patch",
                data: {
                    avatar: url ? url : auth.user.avatar,
                    name: name ? name : auth.user.name
                },
                headers: {
                    Authorization: access_token
                }
            });

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const resetPassword = (password: string, cf_password: string, token: string) => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;

        const check = checkPassword(password, cf_password);
        if (check.length > 0) return dispatch({ type: alertTypes.ALERT, payload: { errors: check } });

        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios("/api/reset_password", {
                method: "patch",
                data: { password },
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const getUserProfile = (id: string) => {
    return async (dispatch: Dispatch<IAlertType | IUserProfileType>) => {
        try {
            const res = await axios(`/api/user/${id}`, {
                method: "get"
            })

            dispatch({
                type: GET_USER_PROFILE,
                payload: res.data
            })

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}