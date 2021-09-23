import { GET_BLOG, IGetBlogType } from "../types/blogTypes";
import { IBlog } from "../../utils/Typescript";


export const blogsReducer = (state: IBlog[] = [], action: IGetBlogType): IBlog[] => {
    switch (action.type) {
        case GET_BLOG:
            return [...state, action.payload]
        default:
            return state
    }
}