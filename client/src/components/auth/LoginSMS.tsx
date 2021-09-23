import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginSMS } from '../../redux/actions/authActions';
import { FormSubmit } from '../../utils/Typescript';

export default function LoginSMS() {

    const [phone, setPhone] = useState("");

    const dispatch = useDispatch();

    const submitHandler = (e: FormSubmit) => {
        e.preventDefault();

        dispatch(loginSMS(phone));
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group mb-3">
                <label className="form-label" htmlFor="phone">Phone number</label>
                <input type="text" id="phone" className="form-control" value={phone}
                    placeholder="+985413547" onChange={e => setPhone(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-dark w-100 my-1" disabled={!phone}>
                Login
            </button>
        </form>
    )
}
