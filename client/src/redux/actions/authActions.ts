import { Dispatch } from "redux";
import { authTypes, IAuthType } from "../types/authTypes";
import axios from "axios";
import { alertTypes, IAlertType } from "../types/alertTypes";
import { validatePhone } from "../../utils/validate";
import { checkTokenExp } from "../../utils/checkTokenExp";


export const userLogin = (account: string, password: string) => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

            const res = await axios("/api/login", {
                method: "post",
                data: { account, password }
            })

            dispatch({
                type: authTypes.AUTH,
                payload: {
                    user: res.data.user,
                    token: res.data.access_token
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

            localStorage.setItem("firstLogin", "true");
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const googleLogin = (id_token: string) => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

            const res = await axios("/api/google_login", {
                method: "post",
                data: { id_token }
            })

            dispatch({
                type: authTypes.AUTH,
                payload: {
                    user: res.data.user,
                    token: res.data.access_token
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

            localStorage.setItem("firstLogin", "true");
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const registerUser = (name: string, account: string, password: string) => {
    return async (dispatch: Dispatch<IAlertType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

            const res = await axios("/api/register", {
                method: "post",
                data: { account, name, password }
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const activeAccount = (active_token: string) => {
    return async (dispatch: Dispatch<IAlertType>) => {
        try {
            const res = await axios("/api/activateAccount", {
                method: "post",
                data: { active_token }
            })

            dispatch({ type: alertTypes.ALERT, payload: { activeSuccess: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { activeError: err.response.data.msg } });
        }
    }
}

export const refreshToken = () => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {

        const firstLogin = localStorage.getItem("firstLogin");
        if (firstLogin) {
            try {
                dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

                const res = await axios("/api/refresh_token", {
                    method: "get",
                });

                dispatch({
                    type: authTypes.AUTH,
                    payload: {
                        token: res.data.access_token,
                        user: res.data.user
                    }
                })

                dispatch({ type: alertTypes.ALERT, payload: { loading: false } });
            } catch (err: any) {
                dispatch({ type: alertTypes.ALERT, payload: { activeError: err.response.data.msg } });
            }
        }
    }
}


export const userLogout = (token: string) => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            localStorage.removeItem("firstLogin");

            const res = await axios("/api/logout", {
                method: "post",
                headers: {
                    Authorization: access_token
                }
            });

            dispatch({
                type: authTypes.AUTH,
                payload: {}
            })

            dispatch({ type: alertTypes.ALERT, payload: { success: res.data.msg } });
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { activeError: err.response.data.msg } });
        }
    }
}

export const loginSMS = (phone: string) => {
    return async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        try {
            const check = validatePhone(phone);
            if (!check) return dispatch({ type: alertTypes.ALERT, payload: { errors: "Phone number format is incorrect." } })

            dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

            const res = await axios("/api/login_sms", {
                method: "post",
                data: { phone }
            })

            if (!res.data.valid)
                verifySms(phone, dispatch);

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

const verifySms = async (phone: string, dispatch: Dispatch<IAuthType | IAlertType>) => {
    const code = prompt("Enter your code.");
    if (!code) return;

    try {
        dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

        const res = await axios("/api/sms_verify", {
            method: "post",
            data: { phone, code }
        })

        dispatch({
            type: authTypes.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        })

        dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

        localStorage.setItem("firstLogin", "true");
    } catch (err: any) {
        dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });

        setTimeout(() => {
            verifySms(phone, dispatch);
        }, 300);
    }
}

export const forgetPassword = (account: string) => {
    return async (dispatch: Dispatch<IAlertType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } })

            const res = await axios("/api/forget_password", {
                method: "post",
                data: { account }
            })

            dispatch({ type: alertTypes.ALERT, payload: { success: res.data.msg } })

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}