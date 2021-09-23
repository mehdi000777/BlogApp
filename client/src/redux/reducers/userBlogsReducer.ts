import { IUser } from "../../utils/Typescript";
import { CREATE_BLOG_USER, DELETE_BLOG_USER, GET_BLOGS_USER, IBlogsUser, IBlogUserType } from "../types/blogTypes";


export const userBlogsReducer = (state: IBlogsUser[] = [], action: IBlogUserType): IBlogsUser[] => {
    switch (action.type) {
        case GET_BLOGS_USER:
            if (state.every(item => item.id !== action.payload.id)) {
                return [...state, action.payload]
            }
            else {
                return state.map(item => item.id === action.payload.id
                    ? action.payload
                    : item
                )
            }
        case CREATE_BLOG_USER:
            return state.map(item => item.id === (action.payload.user as IUser)._id
                ? { ...item, blogs: [...item.blogs, action.payload] }
                : item
            )
        case DELETE_BLOG_USER:
            return state.map(item => item.id === (action.payload.user as IUser)._id
                ? { ...item, blogs: item.blogs.filter(item => item._id !== action.payload._id) }
                : item
            )
        default:
            return state
    }
}