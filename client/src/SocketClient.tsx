import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore, IComment } from './utils/Typescript';
import { CREATE_COMMENT, DELETE_COMMENT, DELETE_REPLY_COMMENT, REPLY_COMMENT, UPDATE_COMMENT } from './redux/types/commentTypes';

export default function SocketClient() {

    const { socket } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        socket.on("createComment", (data: IComment) => {
            dispatch({
                type: CREATE_COMMENT,
                payload: data
            })
        })

        return () => { socket.off("createComment") }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return;

        socket.on("replyComment", (data: IComment) => {
            dispatch({
                type: REPLY_COMMENT,
                payload: data
            })
        })

        return () => { socket.off("replyComment") }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return;

        socket.on("updateComment", (data: IComment) => {
            dispatch({
                type: UPDATE_COMMENT,
                payload: data
            });
        })

        return () => { socket.off("updateComment") }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return;

        socket.on("deleteComment", (data: IComment) => {
            dispatch({
                type: data.comment_root ? DELETE_REPLY_COMMENT : DELETE_COMMENT,
                payload: data
            });
        })

        return () => { socket.off("deleteComment") }
    }, [socket, dispatch])

    return (
        <div>

        </div>
    )
}
