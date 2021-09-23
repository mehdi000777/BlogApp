import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import LoginPass from '../components/auth/LoginPass';
import LoginSMS from '../components/auth/LoginSMS';
import SocialLogin from '../components/auth/SocialLogin';
import { RootStore } from '../utils/Typescript';

export default function Login() {

    const [sms, setSms] = useState(false);

    const history = useHistory();

    const { auth } = useSelector((state: RootStore) => state)

    useEffect(() => {
        let url = history.location.search;

        if (auth.token) {
            if (url === "") {
                history.push("/");
            }
            else {
                let search = "/" + url.slice(1, url.length);
                history.push(search);
            }
        }
    }, [auth.token, history])

    return (
        <div className="auth_page mb-2">
            <div className="auth_box">
                <h2 className="text-uppercase text-center mb-4">
                    Login
                </h2>

                <SocialLogin />

                {sms ? <LoginSMS /> : <LoginPass />}

                <small className="row my-2 text-primary" style={{ cursor: "pointer" }}>
                    <span className="col-6">
                        <Link to="/forget_password">
                            Forget Password ?
                        </Link>
                    </span>

                    <span className="col-6 text-end" onClick={() => setSms(!sms)}>
                        {sms ? "Sign in with password" : "Sign in with SMS"}
                    </span>
                </small>
                <span>
                    You don't have an account? <Link to={`/register${history.location.search}`} style={{ color: "crimson" }}>Register Now</Link>
                </span>
            </div>
        </div>
    )
}
