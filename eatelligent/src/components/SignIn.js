import React, { useState, useEffect } from 'react';
import './signin.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in by checking local storage
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Sign in successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error: Failed to fetch');
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Logout successful');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error: Failed to fetch');
            console.error('Error:', error);
        }
    };

    return (
        <div className="signin-container">
            <h1 className="signin-title">Sign In</h1>
            {isLoggedIn ? (
                <div>
                    <p>You are logged in.</p>
                    <button onClick={handleLogout} className="signin-button">Logout</button>
                </div>
            ) : (
                <form className="signin-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="signin-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="signin-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="signin-button">Submit</button>
                </form>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default SignIn;