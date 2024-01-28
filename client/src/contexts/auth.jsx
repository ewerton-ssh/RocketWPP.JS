import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import data from "../../json/user.json"

export const AuthContext = createContext({})

function AuthProvider ({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadStorage(){
            const login = sessionStorage.getItem('SystemUser');
            if(login){
                setUser(login);
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage()
    }, [])

    async function signIn(user, password){
        if (user === data.username && password === data.password){
            toast.success('Successfully logged in');
            storageUser(JSON.stringify(data));
            setUser(JSON.stringify(data));
        } else {
            toast.error('Incorrect login')
        }
    }

    function storageUser(data){
      sessionStorage.setItem('SystemUser', data);
    }

    function signOut(){
        setUser(null);
        sessionStorage.removeItem('SystemUser', null);
    }

    return(
        <AuthContext.Provider
        value={{
            authenticated: !!user,
            user,
            signOut,
            loading,
            signIn,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;