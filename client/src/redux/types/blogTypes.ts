import { IBlog } from "../../utils/Typescript";

export const GET_HOME_BLOGS = "GET_HOME_BLOGS";
export const GET_BLOGS_BY_CATEGORY = "GET_BLOGS_BY_CATEGORY";
export const GET_BLOGS_USER = "GET_BLOGS_USER";
export const CREATE_BLOG_USER = "CREATE_BLOG_USER";
export const DELETE_BLOG_USER = "DELETE_BLOG_USER";
export const GET_BLOG = "GET_BLOG";

export interface IHomeBlogs {
    _id: string
    count: number
    name: string
    blogs: IBlog[]
}

export interface IBlogsByCategory {
    id: string
    blogs: IBlog[]
    total: number
    search: string
}

export interface IBlogsUser {
    id: string
    blogs: IBlog[]
    total: number
    search: string
}

export interface IGetHomeBlogsType {
    type: typeof GET_HOME_BLOGS
    payload: IHomeBlogs[]
}

export interface ICreateBlogsUserType {
    type: typeof CREATE_BLOG_USER
    payload: IBlog
}

export interface IGetBlogsUserType {
    type: typeof GET_BLOGS_USER
    payload: IBlogsUser
}

export interface IGetBlogsByCategoryType {
    type: typeof GET_BLOGS_BY_CATEGORY
    payload: IBlogsByCategory
}

export interface IDeleteBlogType {
    type: typeof DELETE_BLOG_USER
    payload: IBlog
}

export interface IGetBlogType {
    type: typeof GET_BLOG
    payload: IBlog
}

export type IBlogUserType =
    | IGetBlogsUserType
    | ICreateBlogsUserType
    | IDeleteBlogType