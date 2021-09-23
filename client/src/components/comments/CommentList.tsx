import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteComment, replyComment, updateComment } from '../../redux/actions/commentActions';
import { IComment, RootStore } from '../../utils/Typescript'
import Input from './Input';

interface IProps {
    comment: IComment
    showReplys: IComment[]
    setShowReplys: (showReplys: IComment[]) => void
}

const CommentList: React.FC<IProps> = ({ children, comment, showReplys, setShowReplys }) => {
    const [onReply, setOnReply] = useState(false);
    const [edit, setEdit] = useState<IComment>();

    const { auth } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    const replyHandler = (body: string) => {
        if (!auth.user || !auth.token) return;

        const data = {
            content: body,
            user: auth.user,
            reply_user: comment.user,
            blog_id: comment.blog_id,
            blog_user_id: comment.blog_user_id,
            replyCM: [],
            comment_root: comment.comment_root || comment._id,
            createdAt: new Date().toISOString()
        }

        setShowReplys([...showReplys, data]);
        dispatch(replyComment(data, auth.token))
        setOnReply(false);
    }

    const Nav = (comment: IComment) => {
        return (
            <div>
                <i className="fas fa-trash-alt mx-2" onClick={() => deleteHandler(comment)}></i>
                <i className="fas fa-edit me-2" onClick={() => setEdit(comment)}></i>
            </div>
        )
    }

    const deleteHandler = (comment: IComment) => {
        if (!auth.token) return;

        dispatch(deleteComment(comment, auth.token));
    }

    const updateHandler = (body: string) => {
        if (!auth.user || !auth.token || !edit) return;

        if (body === edit.content) return setEdit(undefined)

        const newComment = { ...edit, content: body }

        dispatch(updateComment(newComment, auth.token))

        setEdit(undefined)
    }

    return (
        <div className="w-100">
            {
                edit
                    ? <Input
                        callback={updateHandler}
                        edit={edit}
                        setEdit={setEdit}
                    />
                    : <div className="comment_box">
                        <div className="p-2" dangerouslySetInnerHTML={{ __html: comment.content }}></div>

                        <div className="d-flex justify-content-between p-2">
                            <small style={{ cursor: "pointer" }} onClick={() => setOnReply(!onReply)}>
                                {onReply ? "- Cansel -" : "- Reply -"}
                            </small>
                            <small className="d-flex">
                                <div className="comment_nav">
                                    {
                                        comment.blog_user_id === auth.user?._id
                                            ? comment.user._id === auth.user._id
                                                ? Nav(comment)
                                                : <i className="fas fa-trash-alt mx-2"
                                                    onClick={() => deleteHandler(comment)}></i>
                                            : comment.user._id === auth.user?._id && Nav(comment)
                                    }
                                </div>
                                <div>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                            </small>
                        </div>
                    </div>
            }
            {
                onReply && <Input callback={replyHandler} />
            }

            {children}
        </div>
    )
}

export default CommentList;
