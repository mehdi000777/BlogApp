import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/actions/profileActions';
import { IUser, RootStore } from '../../utils/Typescript';
import Spiner from '../global/Spiner';

interface IProps {
    id: string
}

export default function OtherProfile({ id }: IProps) {

    const [profile, setProfile] = useState<IUser>();

    const { usersProfile } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;

        if (usersProfile.every(item => item._id !== id)) {
            dispatch(getUserProfile(id))
        }
        else {
            const user = usersProfile.find(item => item._id === id);
            if (user) setProfile(user);
        }

    }, [id, usersProfile, dispatch])

    if (!profile) return <Spiner />
    return (
        <div className="profile_info text-center rounded">

            <div className="avatar_info">
                <img src={profile.avatar} alt="avatar" />
            </div>

            <h5 className="text-uppercase text-danger my-2">{profile.role}</h5>
            
            <div>
                Name: <span className="text-info">{profile.name}</span>
            </div>

            <div className="my-1">
                <div>Email/Phone number</div>
                <span className="text-info">{profile.account}</span>
            </div>

            <div className="my-1">
                Join Date: <span style={{ color: "#ffc107" }}>
                    {new Date(profile.createdAt).toLocaleString()}
                </span>
            </div>

        </div>
    )
}
