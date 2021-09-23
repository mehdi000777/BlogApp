import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { userLogin } from '../../redux/actions/authActions';
import { FormSubmit } from '../../utils/Typescript';

export default function LoginPass() {

    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [typePass, setTypePass] = useState(false);

    const dispatch = useDispatch();

    const submitHandler = (e: FormSubmit) => {
        e.preventDefault();
        dispatch(userLogin(account, password));
    }

    return (
        <form onSubmit={submitHandler}>

            <div className="form-group mb-3">
                <label htmlFor="account" className="form-label">Email / Phone number</label>
                <input type="text" id="account" className="form-control"
                    value={account} onChange={e => setAccount(e.target.value)} />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="pass">
                    <input type={typePass ? "text" : "password"} id="password" className="form-control"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hiden" : "Show"}
                    </small>
                </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 my-1" disabled={!account || !password}>
                Login
            </button>

        </form>
    )
}
