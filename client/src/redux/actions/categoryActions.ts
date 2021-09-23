import axios from "axios";
import { Dispatch } from "react";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { ICategory } from "../../utils/Typescript";
import { alertTypes, IAlertType } from "../types/alertTypes";
import {
    CREATE_CATEGORY,
    DELETE_CATEGORY,
    GET_CATEGORIES,
    ICategoryType,
    UPDATE_CATEGORY
} from "../types/categoryTypes";


export const createCategroy = (name: string, token: string) => {
    return async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios("/api/category", {
                method: "post",
                data: { name },
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({
                type: CREATE_CATEGORY,
                payload: res.data.newCategory
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const getCategroies = () => {
    return async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios("/api/category", {
                method: "get",
            })

            dispatch({
                type: GET_CATEGORIES,
                payload: res.data.categories
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const updateCategroy = (data: ICategory, token: string) => {
    return async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({
                type: UPDATE_CATEGORY,
                payload: data
            })

            await axios(`/api/category/${data._id}`, {
                method: "patch",
                data: { name: data.name },
                headers: {
                    Authorization: access_token
                }
            })

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const deleteCategroy = (id: string, token: string) => {
    return async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {

            await axios(`/api/category/${id}`, {
                method: "delete",
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({
                type: DELETE_CATEGORY,
                payload: id
            })

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}