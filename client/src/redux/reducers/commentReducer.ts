import { CREATE_COMMENT, DELETE_COMMENT, DELETE_REPLY_COMMENT, GET_COMMENTS, ICommentState, ICommentType, REPLY_COMMENT, UPDATE_COMMENT } from "../types/commentTypes";

const initialState = {
    data: [],
    total: 1,
}

export const commentReducer = (state: ICommentState = initialState, action: ICommentType): ICommentState => {
    switch (action.type) {
        case CREATE_COMMENT:
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        case GET_COMMENTS:
            return action.payload
        case REPLY_COMMENT:
            return {
                ...state,
                data: state.data.map(item => item._id === action.payload.comment_root
                    ? { ...item, replyCM: [...item.replyCM, action.payload] }
                    : item
                )
            }
        case UPDATE_COMMENT:
            return {
                ...state,
                data: state.data.map(item => item._id === action.payload._id
                    ? action.payload
                    : {
                        ...item, replyCM: item.replyCM?.map(item => item._id === action.payload._id
                            ? action.payload
                            : item
                        )
                    }
                )
            }
        case DELETE_COMMENT:
            return {
                ...state,
                data: state.data.filter(item => item._id !== action.payload._id)
            }
        case DELETE_REPLY_COMMENT:
            return {
                ...state,
                data: state.data.map(item => item._id === action.payload.comment_root
                    ? { ...item, replyCM: item.replyCM?.filter(item => item._id !== action.payload._id) }
                    : item
                )
            }
        default:
            return state
    }
}