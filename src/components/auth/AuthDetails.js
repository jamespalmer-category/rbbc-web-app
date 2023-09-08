import React, {useEffect, useState} from 'react';
import {auth} from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {Link} from 'react-router-dom'

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
        } else {
            setAuthUser(null);
        }
    });
        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful')
        }).catch(error => console.log(error))
    }
    return (
        <div>{authUser ? <><p>{`Signed In with ${authUser.email}`}</p><button class="centered-button" onClick={userSignOut}>Sign Out</button></> : <><p>Not Logged In</p><Link to="/LoginPage">Login</Link></>}</div>
    )
}

export default AuthDetails;