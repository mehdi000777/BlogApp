import { FormEvent, ChangeEvent } from 'react';
import rootReducer from '../redux/reducers/index';

export type inputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export type FormSubmit = FormEvent<HTMLFormElement>

export type RootStore = ReturnType<typeof rootReducer>

export interface IUser {
    avatar: string
    role: string
    type: string
    _id: string
    name: string
    account: string
    password: string
    createdAt: string
    updatedAt: string
}

export interface IAlert {
    loading?: boolean
    success?: string | string[]
    errors?: string | string[]
    activeSuccess?: string
    activeError?: string
}

export interface ICategory {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface IBlog {
    _id?: string
    user: string | IUser
    title: string
    content: string
    description: string
    thumbnail: string | File
    category: string
    createdAt: string
}

export interface IComment {
    _id?: string
    user: IUser
    blog_id: string
    blog_user_id: string
    content: string
    replyCM: IComment[]
    reply_user?: IUser
    comment_root?: string
    createdAt: string
}