import React, { useState } from 'react';
import './SignUp.css';

function SignUp() {
    const [name, setName] = useState('');
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
                body: JSON.stringify({ name, password, email }),
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
            <h1 className="signup-title">Sign Up</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="signup-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
            {message && <p className="signup-message">{message}</p>}
        </div>
    );
}

export default SignUp;