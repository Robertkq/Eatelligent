import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLoggedIn(true);
            setUserId(user.id); // Ensure the correct field name is used
            setName(user.name); // Ensure the correct field name is used
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signin', { email, password });
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoggedIn(true);
            setUserId(user.id); // Ensure the correct field name is used
            setName(user.name); // Ensure the correct field name is used
            setMessage('Logged in successfully');
        } catch (error) {
            setMessage('Failed to log in');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserId(null);
        setName('');
        setMessage('Logged out successfully');
    };

    return (
        <div className="signin-container">
            <h1 className="signin-title">Sign In</h1>
            {isLoggedIn ? (
                <div>
                    <p>Welcome, {name}!</p>
                    <p>User ID: {userId}</p>
                    <button onClick={handleLogout} className="signin-button">Logout</button>
                </div>
            ) : (
                <form className="signin-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="signin-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
            {message && <p className="signin-message">{message}</p>}
        </div>
    );
};

export default SignIn;