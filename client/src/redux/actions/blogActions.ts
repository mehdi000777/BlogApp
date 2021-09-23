import axios from "axios"
import { Dispatch } from "react"
import { checkTokenExp } from "../../utils/checkTokenExp"
import { imageUpload } from "../../utils/imageUpload"
import { IBlog } from "../../utils/Typescript"
import { alertTypes, IAlertType } from "../types/alertTypes"
import { GET_BLOGS_BY_CATEGORY, GET_HOME_BLOGS, IGetBlogType, IGetBlogsByCategoryType, IGetHomeBlogsType, GET_BLOG, GET_BLOGS_USER, IBlogUserType, CREATE_BLOG_USER, DELETE_BLOG_USER } from "../types/blogTypes"


export const createBlog = (blog: IBlog, token: string) => {
    return async (dispatch: Dispatch<IAlertType | IBlogUserType>) => {
        let url;

        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;

        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            if (typeof (blog.thumbnail) !== "string") {
                const image = await imageUpload(blog.thumbnail);
                url = image.url;
            }

            const newBlog = { ...blog, thumbnail: url }

            const res = await axios("/api/blog", {
                method: "post",
                data: newBlog,
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({
                type: CREATE_BLOG_USER,
                payload: res.data
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false, success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}

export const getHomeBlogs = () => {
    return async (dispatch: Dispatch<IAlertType | IGetHomeBlogsType>) => {
        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios("/api/home/blogs", {
                method: "get"
            });

            dispatch({
                type: GET_HOME_BLOGS,
                payload: res.data
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const getBlogsByCategory = (category_id: string, search: string) => {
    return async (dispatch: Dispatch<IAlertType | IGetBlogsByCategoryType>) => {
        try {
            let limit = 8;
            let value = search ? search : `?page=${1}`

            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios(`/api/blogs/category/${category_id}${value}&limit=${limit}`, {
                method: "get"
            });

            dispatch({
                type: GET_BLOGS_BY_CATEGORY,
                payload: {
                    ...res.data,
                    id: category_id,
                    search
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false } });
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const getUserBlogs = (id: string, search: string) => {
    return async (dispatch: Dispatch<IAlertType | IBlogUserType>) => {
        try {
            let limit = 3;
            let value = search ? search : `?page=${1}`

            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            const res = await axios(`/api/blogs/user/${id}${value}&limit=${limit}`, {
                method: "get"
            })

            dispatch({
                type: GET_BLOGS_USER,
                payload: {
                    ...res.data,
                    id,
                    search
                },
            })

            dispatch({ type: alertTypes.ALERT, payload: { loading: false } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const getBlog = (id: string) => {
    return async (dispatch: Dispatch<IAlertType | IGetBlogType>) => {
        try {
            const res = await axios(`/api/blog/${id}`, {
                method: "get"
            })

            dispatch({
                type: GET_BLOG,
                payload: res.data
            })

        } catch (err: any) {
            console.log(err.response)
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const updateBlog = (blog: IBlog, token: string) => {
    return async (dispatch: Dispatch<IAlertType>) => {
        let url;

        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;

        try {
            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });

            if (typeof (blog.thumbnail) !== "string") {
                const image = await imageUpload(blog.thumbnail);
                url = image.url;
            }
            else {
                url = blog.thumbnail
            }

            const newBlog = { ...blog, thumbnail: url }

            const res = await axios(`/api/blog/${blog._id}`, {
                method: "put",
                data: newBlog,
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { success: res.data.msg } });

        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}


export const deleteBlog = (blog: IBlog, token: string) => {
    return async (dispatch: Dispatch<IAlertType | IBlogUserType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({
                type: DELETE_BLOG_USER,
                payload: blog
            })

            const res = await axios(`/api/blog/${blog._id}`, {
                method: "delete",
                headers: {
                    Authorization: access_token
                }
            })

            dispatch({ type: alertTypes.ALERT, payload: { success: res.data.msg } });
        } catch (err: any) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err.response.data.msg } });
        }
    }
}