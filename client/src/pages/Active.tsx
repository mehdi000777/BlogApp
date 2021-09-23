import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activeAccount } from '../redux/actions/authActions';
import { RootStore } from '../utils/Typescript';

interface IParams {
    active_token: string
}

export default function Active() {

    const { active_token }: IParams = useParams();

    const { alert } = useSelector((state: RootStore) => state);
    const { activeError, activeSuccess } = alert;

    const dispatch = useDispatch();

    useEffect(() => {
        if (active_token) {
            dispatch(activeAccount(active_token));
        }
    }, [active_token, dispatch])

    return (
        <div>
            {activeError && <div className="bg-danger text-light text-center">{activeError}</div>}
            {activeSuccess && <div className="bg-success text-light text-center">{activeSuccess}</div>}
        </div>
    )
}
