import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {

    const history = useHistory();

    return (
        <div className="auth_page mb-2">
            <div className="auth_box">
                <h2 className="text-uppercase text-center mb-4">
                    Register
                </h2>
                <RegisterForm />
                <p className="mt-2">
                    Already have an account? <Link to={`/login${history.location.search}`} style={{ color: "crimson" }}>Login Now</Link>
                </p>
            </div>
        </div>
    )
}
