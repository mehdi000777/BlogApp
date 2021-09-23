import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import UserProfile from '../components/profile/UserProfile';
import OtherProfile from '../components/profile/OtherProfile';
import UserBloges from '../components/profile/UserBloges';
import { RootStore } from '../utils/Typescript';

interface IParams {
    id: string
}

export default function Profile() {

    const { auth } = useSelector((state: RootStore) => state);

    const { id }: IParams = useParams();

    return (
        <div className="row my-3">
            <div className="col-md-5 mb-3">
                {
                    auth.user?._id === id
                        ? <UserProfile />
                        : <OtherProfile id={id} />
                }
            </div>

            <div className="col-md-7 mb-3">
                <UserBloges id={id} />
            </div>
        </div>
    )
}
