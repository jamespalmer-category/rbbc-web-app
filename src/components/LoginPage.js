import React from 'react';
import Login from './auth/Login';
import SignUp from './auth/SignUp';

const LoginPage = () => {
    return (
        <div className="LoginPage">
            <p>Already have an account? Log In!</p>
            <Login />
            <p>Not logged in? Sign up below!</p>
            <SignUp />
        </div>
    )
}

export default LoginPage;