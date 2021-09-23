import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { forgetPassword } from '../redux/actions/authActions';
import { FormSubmit } from '../utils/Typescript';

export default function ForgetPassowrd() {
    const [account, setAccount] = useState("");

    const dispatch = useDispatch();

    const submitHanlder = (e: FormSubmit) => {
        e.preventDefault();
        
        dispatch(forgetPassword(account))
    }

    return (
        <div className="my-4" style={{ maxWidth: "500px" }}>
            <h3>Forget Password?</h3>

            <form className="form-group" onSubmit={submitHanlder}>
                <label htmlFor="account">Email / Phone number</label>
                <div className="d-flex align-items-center">
                    <input type="text" className="form-control" id="account"
                        onChange={e => setAccount(e.target.value)} />

                    <button type="submit" className="btn btn-primary mx-2 d-flex align-items-center">
                        <i className="fas fa-paper-plane me-2"></i> send
                    </button>
                </div>
            </form>
        </div>
    )
}
