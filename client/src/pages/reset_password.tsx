import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router'
import { resetPassword } from '../redux/actions/profileActions';
import { FormSubmit } from '../utils/Typescript';

interface IPrams {
    token: string
}

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [cf_Password, setCf_Password] = useState("");
    const [typePass, setTypePass] = useState(false);
    const [typeCf_Pass, setTypeCf_Pass] = useState(false);

    const { token }: IPrams = useParams()

    const dispatch = useDispatch();

    const submitHandler = (e:FormSubmit) => {
        e.preventDefault();

        dispatch(resetPassword(password, cf_Password, token));
    }

    return (
        <div className="auth_page">
            <form className="auth_box" onSubmit={submitHandler}>
                <h3 className="text-uppercase text-center mb-4">Reset Password</h3>

                <div className="form-group my-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"} id="password" className="form-control"
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? "Hiden" : "Show"}
                        </small>
                    </div>
                </div>

                <div className="form-group my-2">
                    <label htmlFor="cf_Password" className="form-label">Confirm Password</label>
                    <div className="pass">
                        <input type={typeCf_Pass ? "text" : "password"} id="cf_Password" className="form-control" value={cf_Password}
                            onChange={e => setCf_Password(e.target.value)} />
                        <small onClick={() => setTypeCf_Pass(!typeCf_Pass)}>
                            {typeCf_Pass ? "Hiden" : "Show"}
                        </small>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                    Submit
                </button>
            </form>
        </div>
    )
}
