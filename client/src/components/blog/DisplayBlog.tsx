import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { createComment, getComments } from '../../redux/actions/commentActions';
import { IBlog, IComment, IUser, RootStore } from '../../utils/Typescript';
import Comments from '../comments/Comments';
import Input from '../comments/Input';
import Spiner from '../global/Spiner';
import Pagination from '../global/Pagination';

interface IProps {
    blogInfo: IBlog
}

export default function DisplayBlog({ blogInfo }: IProps) {
    const [showComments, setShowComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const dispatch = useDispatch();

    const { auth, comments } = useSelector((state: RootStore) => state);

    const commentHandler = (body: string) => {
        if (!auth.user || !auth.token) return;

        const data = {
            content: body,
            user: auth.user,
            blog_id: (blogInfo._id as string),
            blog_user_id: (blogInfo.user as IUser)._id,
            replyCM: [],
            createdAt: new Date().toISOString()
        }

        setShowComments([data, ...showComments])
        dispatch(createComment(data, auth.token));
    }

    const fetchComments = useCallback(async (id: string, num = 1) => {
        setLoading(true);
        await dispatch(getComments(id, num));
        setLoading(false);
    }, [dispatch])

    useEffect(() => {
        if (!blogInfo._id) return;

        const num = history.location.search.slice(6) || 1;

        fetchComments(blogInfo._id, num);
    }, [blogInfo._id, fetchComments, history])

    useEffect(() => {
        setShowComments(comments.data);
    }, [comments.data])

    const paginationHandler = async (num: number) => {
        if (!blogInfo._id) return;

        fetchComments(blogInfo._id, num);
    }

    return (
        <div>
            <h2 className="text-center text-capitalize" style={{ color: "#ff7a00" }}>{blogInfo.title}</h2>
            <div className="my-3 text-end fw-bold" style={{ color: "teal" }}>
                {
                    typeof (blogInfo.user) !== "string" &&
                    <small>By: {blogInfo.user.name}</small>
                }
                <small className="ms-2">{new Date(blogInfo.createdAt).toLocaleString()}</small>
            </div>
            <div className="show_html" dangerouslySetInnerHTML={{ __html: blogInfo.content }}></div>

            <hr className="my-1" />
            <h3 style={{ color: "#ff7a00" }}>* Comments *</h3>

            {
                auth.user
                    ? < Input callback={commentHandler} />
                    : <h5>Please <Link to={`/login?blog/${blogInfo._id}`}>login</Link> to comment.</h5>
            }

            {
                loading
                    ? <Spiner />
                    : showComments.map((comment, index) => (
                        <Comments key={index} comment={comment} />
                    ))
            }

            {comments.total > 1 && <Pagination total={comments.total} callback={paginationHandler} />}
        </div>
    )
}
