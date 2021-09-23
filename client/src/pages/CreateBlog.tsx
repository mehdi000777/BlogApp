import React from 'react'
import { useState, useRef } from 'react'
import ReactQuill from '../components/editor/ReactQuill';
import { useDispatch, useSelector } from 'react-redux';
import CardHoriz from '../components/cards/CardHoriz';
import CreateForm from '../components/cards/CreateForm';
import { IBlog, IUser, RootStore } from '../utils/Typescript';
import Notfound from './Notfound';
import { createBlog, updateBlog } from '../redux/actions/blogActions';
import { shallowEqual, validateCreateBlog } from '../utils/validate';
import { alertTypes } from '../redux/types/alertTypes';
import { useEffect } from 'react';
import axios from 'axios';

interface IProps {
    slug?: string
}

export default function CreateBlog({ slug }: IProps) {
    const initState = {
        user: "",
        title: "",
        content: "",
        description: "",
        thumbnail: "",
        category: "",
        createdAt: new Date().toISOString()
    }

    const divRef = useRef<HTMLDivElement>(null);

    const [blog, setBlog] = useState<IBlog>(initState);
    const [body, setBody] = useState("");
    const [text, setText] = useState("");

    const [oldData, setOldData] = useState<IBlog>();

    const { auth } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            const content = (div?.innerText as string);
            setText(content);
        }
    }, [body])

    useEffect(() => {
        if (!slug) return;

        axios(`/api/blog/${slug}`, {
            method: "get"
        }).then(res => {
            setBlog(res.data);
            setBody(res.data.content);
            setOldData(res.data);
        }).catch(err => {
            console.log(err);
        })

        const initData = {
            user: "",
            title: "",
            content: "",
            description: "",
            thumbnail: "",
            category: "",
            createdAt: new Date().toISOString()
        }

        return () => {
            setBlog(initData);
            setBody("");
            setOldData(initData);
        }

    }, [slug])

    const submitHandler = () => {
        if (!auth.token) return;

        const check = validateCreateBlog({ ...blog, content: text });
        if (check.length !== 0) {
            return dispatch({ type: alertTypes.ALERT, payload: { errors: check } });
        }

        let newData = { ...blog, content: body };

        if (slug) {
            if ((blog.user as IUser)._id !== auth.user?._id)
                return dispatch({
                    type: alertTypes.ALERT,
                    payload: { errors: "Invalid Authntication." }
                })

            const result = shallowEqual(oldData, newData);
            if (result) return dispatch({
                type: alertTypes.ALERT,
                payload: { errors: "The data does not change." }
            })

            dispatch(updateBlog(newData, auth.token));
        }
        else {
            dispatch(createBlog(newData, auth.token));
        }
    }

    if (!auth.token) return <Notfound />
    return (
        <div className="my-4 create_blog">
            <h2>Create Blog</h2>

            <div className="row mt-4">
                <div className="col-md-6">
                    <h5>Create</h5>
                    <CreateForm blog={blog} setBlog={setBlog} />
                </div>

                <div className="col-md-6">
                    <h5>Preview</h5>
                    <CardHoriz blog={blog} />
                </div>
            </div>

            <ReactQuill setBody={setBody} body={body} />
            <small>{text.trim().length}</small>

            <div ref={divRef} dangerouslySetInnerHTML={{
                __html: body
            }} style={{ display: "none" }}></div>

            <button className="btn btn-dark d-block my-3 mx-auto" onClick={submitHandler}>
                {slug ? "Update Post" : "Create Post"}
            </button>
        </div>
    )
}
