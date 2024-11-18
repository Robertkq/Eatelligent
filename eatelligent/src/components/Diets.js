import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Diets() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dietMessage, setDietMessage] = useState('');

    useEffect(() => {
        // Check if the user is logged in by checking local storage
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleCreateNewDiet = async () => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 
        const prompt = 'Create a new diet plan for a healthy lifestyle. No meat, generate 7 days worth of calories and nutrients, for losing weight. I like apples';

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini', 
                    messages: [{ role: 'user', content: prompt }], 
                    max_tokens: 200,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            setDietMessage(response.data.choices[0].message.content);
        } catch (error) {
            console.error('Error creating new diet:', error);
            console.error('Error response:', error.response);
            setDietMessage('Failed to create a new diet.');
        }
    };

    if (!isLoggedIn) {
        return <div>Must be logged in</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <h2>Diets</h2>
            <ul>
                <li>Diet 1</li>
                <li>Diet 2</li>
                <li>Diet 3</li>
            </ul>
            <button onClick={handleCreateNewDiet}>Create New Diet</button>
            <h2>Diet Details</h2>
            <p>{dietMessage}</p>
        </div>
    );
}

export default Diets;
