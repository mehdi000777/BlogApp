import React from 'react'
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../../redux/actions/authActions';

export default function SocialLogin() {

    const dispatch = useDispatch();

    const onSuccess = (user: GoogleLoginResponse) => {
        const id_token = user.getAuthResponse().id_token;

        dispatch(googleLogin(id_token));
    }

    return (
        <div className="my-2">
            <GoogleLogin
                client_id="435725971031-ldrm7rireenb936ffs9qease7cnollov.apps.googleusercontent.com"
                cookiepolicy='single_host_origin'
                onSuccess={onSuccess}
                />
        </div>
    )
}
