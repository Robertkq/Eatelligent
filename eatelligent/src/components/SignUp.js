import React, { useState } from 'react';
import './signup.css';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User signed up successfully!');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error: Failed to fetch');
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <p>Sign up form.</p>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="signup-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="signup-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="signup-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="signup-button">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SignUp;