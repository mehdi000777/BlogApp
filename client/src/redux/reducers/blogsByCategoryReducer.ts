import { GET_BLOGS_BY_CATEGORY, IGetBlogsByCategoryType, IBlogsByCategory } from "../types/blogTypes";


export const blogsByCategoryReducer = (state: IBlogsByCategory[] = [], action: IGetBlogsByCategoryType): IBlogsByCategory[] => {
    switch (action.type) {
        case GET_BLOGS_BY_CATEGORY:
            if (state.every(item => item.id !== action.payload.id)) {
                return [...state, action.payload]
            } else {
                return state.map(item => item.id === action.payload.id
                    ? action.payload
                    : item
                )
            }

        default:
            return state
    }
}