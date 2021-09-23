import React from 'react';
import { useDispatch } from 'react-redux';
import { alertTypes } from '../../redux/types/alertTypes';

interface IProps {
    title: string
    body: string | string[]
    bgColor: string
}

export default function Toast({ title, body, bgColor }: IProps) {

    const dispatch = useDispatch();

    const closeHandler = () => {
        dispatch({
            type: alertTypes.ALERT,
            payload: {}
        })
    }

    return (
        <div className={`toast show position-fixed text-light ${bgColor}`}
            style={{ top: "5px", right: "5px", minWidth: "200px", zIndex: 1021 }}>
            <div className={`toast-header text-light ${bgColor}`}>
                <strong className="me-auto">{title}</strong>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"
                    onClick={closeHandler}></button>
            </div>
            <div className="toast-body">
                {
                    typeof (body) === "string"
                        ? body
                        : <ul>
                            {body.map((text, index) => (
                                <li key={index}>{text}</li>
                            ))}
                        </ul>
                }
            </div>
        </div>
    )
}
