import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/actions/authActions';
import { alertTypes } from '../../redux/types/alertTypes';
import { FormSubmit } from '../../utils/Typescript';
import { valid } from '../../utils/validate';

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [cf_Password, setCf_Password] = useState("");
    const [typePass, setTypePass] = useState(false);
    const [typeCf_Pass, setTypeCf_Pass] = useState(false);

    const dispatch = useDispatch();

    const submitHandler = (e: FormSubmit) => {
        e.preventDefault();
        const err = valid(name, account, password, cf_Password);
        if (err.length > 0) {
            dispatch({ type: alertTypes.ALERT, payload: { errors: err } })
        }
        else {
            dispatch(registerUser(name, account, password));
        }
    }

    return (
        <form onSubmit={submitHandler}>

            <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" className="form-control" placeholder="Enter your name..."
                    value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="account" className="form-label">Email / Phone number</label>
                <input type="text" id="account" className="form-control" placeholder="Exampel@gmail.com/+9853222319"
                    value={account} onChange={e => setAccount(e.target.value)} />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="pass">
                    <input type={typePass ? "text" : "password"} id="password" className="form-control"
                        value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password..." />
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hiden" : "Show"}
                    </small>
                </div>
            </div>

            <div className="form-group mb-3">
                <label htmlFor="cf_Password" className="form-label">Confirm Password</label>
                <div className="pass">
                    <input type={typeCf_Pass ? "text" : "password"} id="cf_Password" className="form-control" value={cf_Password}
                        onChange={e => setCf_Password(e.target.value)} placeholder="Enter your confirm password..." />
                    <small onClick={() => setTypeCf_Pass(!typeCf_Pass)}>
                        {typeCf_Pass ? "Hiden" : "Show"}
                    </small>
                </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 my-1">
                Register
            </button>

        </form>
    )
}
