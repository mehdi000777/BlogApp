import { GET_HOME_BLOGS, IGetHomeBlogsType, IHomeBlogs } from "../types/blogTypes";


export const homeBlogReducer = (state: IHomeBlogs[] = [], action: IGetHomeBlogsType): IHomeBlogs[] => {
    switch (action.type) {
        case GET_HOME_BLOGS:
            return action.payload
        default:
            return state
    }
}