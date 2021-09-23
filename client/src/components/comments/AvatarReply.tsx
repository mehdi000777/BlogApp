import React from 'react'
import { Link } from 'react-router-dom'
import { IUser } from '../../utils/Typescript'

interface IProps {
    user: IUser
    reply_user?: IUser
}

export default function AvatarReply({ user, reply_user }: IProps) {
    return (
        <div className="avatar_reply">
            <img src={user.avatar} alt="avatar" />

            <div className="ms-1">
                <small>
                    <Link to={`/profile/${user._id}`}>
                        {user.name + " "}
                    </Link>
                </small>

                <small className="reply_text">
                    Reply to <Link to={`/profile/${reply_user?._id}`}>
                        {reply_user?.name}
                    </Link>
                </small>
            </div>
        </div>
    )
}
