import React, { useEffect, useState } from 'react'
import { IComment, } from '../../utils/Typescript'
import AvatarComment from './AvatarComment'
import AvatarReply from './AvatarReply'
import CommentList from './CommentList'

interface IProps {
    comment: IComment
}

export default function Comments({ comment }: IProps) {
    const [showReplys, setShowReplys] = useState<IComment[]>([])
    const [next, setNext] = useState(2);

    useEffect(() => {
        if (!comment.replyCM) return;

        setShowReplys(comment.replyCM)

    }, [comment.replyCM])

    return (
        <div className="my-3 d-flex" style={{
            opacity: comment._id ? "1" : ".5",
            pointerEvents: comment._id ? "initial" : "none"
        }}>
            <AvatarComment user={(comment.user)} />
            <CommentList
                comment={comment}
                showReplys={showReplys}
                setShowReplys={setShowReplys}
            >
                {
                    showReplys.slice(0, next).map(comment => (
                        <div key={comment._id} style={{
                            opacity: comment._id ? "1" : ".5",
                            pointerEvents: comment._id ? "initial" : "none"
                        }}>
                            <AvatarReply user={comment.user} reply_user={comment.reply_user} />
                            <CommentList
                                comment={comment}
                                showReplys={showReplys}
                                setShowReplys={setShowReplys}
                            ></CommentList>
                        </div>
                    ))
                }

                <div style={{ cursor: "pointer" }}>
                    {
                        showReplys.length > next
                            ? <small style={{ color: "crimson" }} onClick={() => setNext(next + 5)}>
                                See More Comments.....
                            </small>
                            : showReplys.length > 2 && <small style={{ color: "teal" }} onClick={() => setNext(2)}>
                                Hide Comments.....
                            </small>
                    }
                </div>

            </CommentList>
        </div >
    )
}
