import React from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signOut } from 'firebase/auth';
import {auth} from '../../firebase'

const AuthDetails = () => {
    const {authUser} = useAuth();


    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful')
        }).catch(error => console.log(error))
    }

    return (
        <div>
            {authUser ? (
                <>
                    <p>{`Signed In with ${authUser.email}`}</p>
                    <button class="centered-button" onClick={userSignOut}>
                        Sign Out
                    </button></> 
                    ) : ( 
                    <>
                        <p>Not Logged In</p>
                        <Link to="/LoginPage">Login</Link>
                    </>)
                    };
            </div>
    )
}

export default AuthDetails;