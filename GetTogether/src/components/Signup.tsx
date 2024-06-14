
import { useState } from 'react';
import '../assets/Login.css';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const videolink = "none";
    const navigate= useNavigate();
    const handleLogin = async () => {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password, videolink }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            console.log("logged in");
            navigate('/');
        } else {
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 3000);
            console.log("wrong credentials");
        }
    };

    return (
        <div>
            <div className="login">
                <div className="triangle1"></div>
                <div className="st1"></div>
                <div className="st2"></div>
                <div className="triangle2"></div>
                <div className="function">
                    <h1>SiGnUp</h1>
                    <div className="credentials">
                        <div className="username">
                            <PersonIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                            <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Username' />
                        </div>
                        <div className="password">
                            <KeyIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='password' />
                        </div>
                        <button onClick={handleLogin}>Signup</button>
                    </div>
                    {alert && (
                        <Alert style={{ marginTop: '20px' }} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Server Error
                      </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
