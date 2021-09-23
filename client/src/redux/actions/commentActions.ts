import axios from "axios"
import { Dispatch } from "react"
import { checkTokenExp } from "../../utils/checkTokenExp"
import { IComment } from "../../utils/Typescript"
import { alertTypes, IAlertType } from "../types/alertTypes"
import { GET_COMMENTS, ICommentType, IGetCommentsType, IReplyCommentType, IUpdateCommentType, UPDATE_COMMENT, IDeleteCommentType } from "../types/commentTypes"


export const createComment = (comment: IComment, token: string) => {
    return async (dispatch: Dispatch<IAlertType | ICommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;

        const { content, blog_id, blog_user_id } = comment;
        try {
            await axios("/api/comment", {
                method: "post",
                data: {
                    content,
                    blog_id,
                    blog_user_id
                },
                headers: {
                    Authorization: access_token
                }
            });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const getComments = (id: string, num: number) => {
    return async (dispatch: Dispatch<IAlertType | IGetCommentsType>) => {
        try {
            let limit = 4;

            const res = await axios(`/api/comment/${id}?page=${num}&limit=${limit}`, {
                method: "get"
            });

            dispatch({
                type: GET_COMMENTS,
                payload: {
                    data: res.data.comments,
                    total: res.data.total
                }
            });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const replyComment = (comment: IComment, token: string) => {
    return async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            await axios("/api/reply_comment", {
                method: "post",
                data: comment,
                headers: {
                    Authorization: access_token
                }
            })

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const updateComment = (data: IComment, token: string) => {
    return async (dispatch: Dispatch<IAlertType | IUpdateCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({
                type: UPDATE_COMMENT,
                payload: data
            });

            const res = await axios(`/api/comment/${data._id}`, {
                method: "patch",
                data: { data },
                headers: {
                    Authorization: access_token
                }
            });

            dispatch({ type: alertTypes.ALERT, payload: { success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const deleteComment = (comment: IComment, token: string) => {
    return async (dispatch: Dispatch<IAlertType | IDeleteCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            await axios(`/api/comment/${comment._id}`, {
                method: "delete",
                headers: {
                    Authorization: access_token
                }
            });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}