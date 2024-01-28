import './signin.css'
import { toast } from 'react-toastify';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (user !== '' && password !== '') {
      signIn(user, password);
    } else {
      toast.error('Empty or invalid field!')
    }
  }

  return (
    
      <>
      
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
    </div>
    <form>
        <h3>RocketWPP.JS</h3>

        <label>Username</label>
        <input type="text" placeholder="User" id="username" value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Password</label>
        <input type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className='loginButton' onClick={handleSubmit}type='submit'> {loadingAuth ? 'Loading...' : 'Log in'} </button>
    </form>
    
    </>
    
  )
}

export default SignIn;