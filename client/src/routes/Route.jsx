import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({
    component: Component,
        isPrivate,
        ...rest
}){
    const { authenticated, loading } = useContext(AuthContext);

    if(loading){
        return(
            <div>
            </div>
        )
    }

    if(!authenticated && isPrivate){
        return<Redirect to="/" />
    }

    if(authenticated && !isPrivate){
        return <Redirect to="/dashboard" />
    }

    return(
        <Route
            {...rest}
            render={ props => (
                <Component {...props} />
            )}
        />
    )
}