import { IComment } from "../../utils/Typescript";

export const CREATE_COMMENT = "CREATE_COMMENT";
export const GET_COMMENTS = "GET_COMMENTS";
export const REPLY_COMMENT = "REPLY_COMMENT";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const DELETE_REPLY_COMMENT = "DELETE_REPLY_COMMENT";

export interface ICommentState {
    data: IComment[]
    total: number
}

export interface ICreateCommentType {
    type: typeof CREATE_COMMENT
    payload: IComment
}

export interface IGetCommentsType {
    type: typeof GET_COMMENTS
    payload: ICommentState
}

export interface IReplyCommentType {
    type: typeof REPLY_COMMENT
    payload: IComment
}

export interface IUpdateCommentType {
    type: typeof UPDATE_COMMENT
    payload: IComment
}

export interface IDeleteCommentType {
    type: typeof DELETE_COMMENT | typeof DELETE_REPLY_COMMENT
    payload: IComment
}

export type ICommentType =
    | ICreateCommentType
    | IGetCommentsType
    | IReplyCommentType
    | IUpdateCommentType
    | IDeleteCommentType