import React, { createContext, useContext, useEffect, useState } from 'react';
import {auth} from '../../firebase';
import { onAuthStateChanged} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  //cosnt [userDisplayName, setUserDisplayName] = useState('')

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
            setAuthUser(user)
            //setUserDisplayName(user.displayName)
    } else {
        setAuthUser(null);
    }
});
    return () => {
        listen();
    };
}, []);

  return (
    <AuthContext.Provider value={{authUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);