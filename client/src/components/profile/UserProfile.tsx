import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Notfound from '../../pages/Notfound';
import { resetPassword, updateUser } from '../../redux/actions/profileActions';
import { FormSubmit, inputChange, RootStore } from '../../utils/Typescript';

export default function UserProfile() {

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<File>();
    const [password, setPassword] = useState("");
    const [cf_Password, setCf_Password] = useState("");

    const [typePass, setTypePass] = useState(false);
    const [typeCf_Pass, setTypeCf_Pass] = useState(false);

    const { auth } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    const imageHandler = (e: inputChange) => {
        const target = e.target as HTMLInputElement;

        const files = target.files;
        if (files) {
            const file = files[0];
            setAvatar(file);
        }
    }

    const submitHandler = (e: FormSubmit) => {
        e.preventDefault();

        if (avatar || name)
            dispatch(updateUser(auth, avatar as File, name));

        if (password && auth.token)
            dispatch(resetPassword(password, cf_Password, auth.token));
    }

    if (!auth.user) {
        return <Notfound />
    }
    return (
        <form className="profile_info rounded" onSubmit={submitHandler}>
            <div className="avatar_info">
                <img src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar} alt="avatar" />
                <span>
                    <i className="fas fa-camera"></i>
                    <p>Change</p>
                    <input type="file" accept="image/*" id="file" onChange={imageHandler} />
                </span>
            </div>

            <div className="form-group my-3">
                <label className="form-label" htmlFor="name">Name</label>
                <input type="text" id="name" className="form-control"
                    defaultValue={auth.user.name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group my-3">
                <label className="form-label" htmlFor="account">Account</label>
                <input type="text" id="account" className="form-control"
                    defaultValue={auth.user.account} disabled />
            </div>

            {
                auth.user.type !== "register" &&
                <small className="text-danger">
                    * Quick login account with {auth.user.type} can`t use this function *
                </small>
            }

            <div className="form-group mb-3">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="pass">
                    <input type={typePass ? "text" : "password"} id="password" className="form-control"
                        onChange={e => setPassword(e.target.value)} disabled={auth.user.type !== "register"} />
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hide" : "Show"}
                    </small>
                </div>
            </div>

            <div className="form-group my-3">
                <label className="form-label" htmlFor="cf_Password">Confirm Password</label>
                <div className="pass">
                    <input type={typeCf_Pass ? "text" : "password"} id="cf_Password" className="form-control"
                        onChange={e => setCf_Password(e.target.value)} disabled={auth.user.type !== "register"} />
                    <small onClick={() => setTypeCf_Pass(!typeCf_Pass)}>
                        {typeCf_Pass ? "Hide" : "Show"}
                    </small>
                </div>
            </div>

            <button type="submit" className="btn btn-dark w-100">
                Update
            </button>
        </form>
    )
}
