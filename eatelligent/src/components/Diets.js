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
        const prompt = 'Create a new diet plan for a healthy lifestyle. No meat, generate 7 days worth of calories and nutrients, for losing weight. I like apples. Generate JSON.';

        const jsonSchema = {
            type: "object",
            properties: {
                day: {
                    type: "integer",
                    description: "Day of the diet plan"
                },
                meals: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            meal: { type: "string" },
                            calories: { type: "integer" },
                            nutrients: { type: "object" }
                        },
                        required: ["meal", "calories", "nutrients"]
                    }
                }
            },
            required: ["day", "meals"]
        };

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 4000,
                    functions: [
                        {
                            name: "generate_diet_plan",
                            description: "Generate a 7-day diet plan",
                            parameters: jsonSchema
                        }
                    ],
                    function_call: {
                        name: "generate_diet_plan",
                        arguments: JSON.stringify({
                            days: 7,
                            preferences: "No meat, likes apples"
                        })
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            console.log('API Response:', response.data);
            if (response.data.choices && response.data.choices.length > 0) {
                const choice = response.data.choices[0];
                console.log('Choice:', choice);
                if (choice.message && choice.message.function_call && choice.message.function_call.arguments) {
                    const argumentsContent = choice.message.function_call.arguments;
                    console.log('Arguments Content:', argumentsContent);
                    setDietMessage(JSON.stringify(JSON.parse(argumentsContent), null, 2));
                } else {
                    console.error('No function call arguments found in the choice');
                    console.log('Full Choice Object:', choice);
                    setDietMessage('No diet plan generated.');
                }
            } else {
                console.error('No choices found in the response');
                setDietMessage('No diet plan generated.');
            }
        } catch (error) {
            console.error('Error creating new diet:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            }
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
            <button>Test Diets</button>
            <h2>Diet Details</h2>
            <p>{dietMessage}</p>
        </div>
    );
}

export default Diets;