import {Switch} from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Add from '../pages/Add';
import ChatBot from '../pages/ChatBot';
import About from '../pages/About';


export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/settings" component={Settings} isPrivate />
            <Route exact path="/bot" component={ChatBot} isPrivate />
            <Route exact path="/about" component={About} isPrivate />
            <Route exact path="/add" component={Add} isPrivate />
        </Switch>
    )
}