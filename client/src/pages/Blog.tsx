import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getBlog } from '../redux/actions/blogActions';
import { IBlog, RootStore } from '../utils/Typescript';
import Spiner from '../components/global/Spiner';
import DisplayBlog from '../components/blog/DisplayBlog';


interface IPrams {
    id: string
}

export default function Blog() {
    const [blogInfo, setBlogInfo] = useState<IBlog>();
    const { socket } = useSelector((state: RootStore) => state);

    const { id }: IPrams = useParams();

    const { blogs } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;

        if (blogs.every(item => item._id !== id)) {
            dispatch(getBlog(id))
        }
        else {
            const blog = blogs.find(item => item._id === id);
            if (blog) setBlogInfo(blog);
        }

    }, [id, dispatch, blogs])

    useEffect(() => {
        if (!id || !socket) return;

        socket.emit("joinRoom", id);

        return () => { socket.emit("outRoom", id) }
    }, [socket, id])

    if (!blogInfo) return <Spiner />
    return (
        <div className="blog_page my-4">
            <DisplayBlog blogInfo={blogInfo} />
        </div>
    )
}
