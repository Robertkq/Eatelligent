import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Diets.css';

const Diets = () => {
    const [dietMessage, setDietMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dietType, setDietType] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const [allergies, setAllergies] = useState('');
    const [preferences, setPreferences] = useState('');
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [userDiets, setUserDiets] = useState([]);
    const [dietPlan, setDietPlan] = useState(null);
    const [dietName, setDietName] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setIsLoggedIn(true);
            fetchUserDiets(user.id);
            fetchUserInformation(user.id);
        }
    }, []);

    const fetchUserDiets = async (user_id) => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/diets', {
                params: { user_id }
            });
            setUserDiets(response.data);
        } catch (error) {
            console.error('Error fetching user diets:', error);
        }
    };

    const fetchUserInformation = async (user_id) => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/info', {
                params: { user_id }
            });
            const userInfo = response.data;
            setSex(userInfo.sex);
            setAge(userInfo.age);
            setHeight(userInfo.height);
            setWeight(userInfo.weight);
            setDietType(userInfo.diet_type);
            setDietGoal(userInfo.diet_goal);
            setAllergies(userInfo.allergies);
            setPreferences(userInfo.preferences);
            setActivityLevel(userInfo.activity_level);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const handleSaveInformation = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('User not logged in');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/user/save', {
                user_id: user.id,
                sex,
                age,
                height,
                weight,
                dietType,
                dietGoal,
                allergies,
                preferences,
                activity_level: activityLevel
            });
            alert('Information saved successfully!');
        } catch (error) {
            console.error('Error saving information:', error);
            alert('Failed to save information.');
        }
    };

    const calculateCalories = (sex, age, height, weight, activityLevel, dietGoal) => {
        let bmr;
        if (sex === 'M') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let activityMultiplier;
        switch (activityLevel) {
            case 'Sedentary':
                activityMultiplier = 1.2;
                break;
            case 'Lightly active':
                activityMultiplier = 1.375;
                break;
            case 'Moderately active':
                activityMultiplier = 1.55;
                break;
            case 'Very active':
                activityMultiplier = 1.725;
                break;
            case 'Super active':
                activityMultiplier = 1.9;
                break;
            default:
                activityMultiplier = 1.55; 
        }

        const maintenanceCalories = bmr * activityMultiplier;

        let targetCalories;
        if (dietGoal === 'Losing fat') {
            targetCalories = maintenanceCalories - 500;
        } else if (dietGoal === 'Gaining weight') {
            targetCalories = maintenanceCalories + 500;
        } else {
            targetCalories = maintenanceCalories;
        }

        return targetCalories;
    };

    const handleCreateNewDiet = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            setDietMessage('User not logged in.');
            return;
        }

        if (!sex || !age || !height || !weight || !activityLevel || !dietGoal) {
            setDietMessage('Please fill out all the required information above.');
            return;
        }

        setIsLoading(true); // Set loading state to true

        try {
            const response = await axios.get('http://localhost:5000/api/user/info', {
                params: { user_id: user.id }
            });
            const userInfo = response.data;

            if (!userInfo.sex || !userInfo.age || !userInfo.height || !userInfo.weight || !userInfo.activity_level || !userInfo.diet_goal) {
                setDietMessage('Please fill out all the required information above.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            const targetCalories = calculateCalories(userInfo.sex, userInfo.age, userInfo.height, userInfo.weight, userInfo.activity_level, userInfo.diet_goal);

            const prompt = `Create a new diet plan for a healthy lifestyle. \
Generate 7 days worth of calories and nutrients, with a target of ${targetCalories} calories per day. \
Include the following preferences: ${userInfo.preferences}. Avoid the following allergies: ${userInfo.allergies}. \
Each meal should have a type_meal (Breakfast, Lunch, Dinner, Snack), a meal (food item), calories, and nutrients (e.g., protein, carbs, fats).`;

            const jsonSchema = {
                type: "object",
                properties: {
                    days: {
                        type: "array",
                        items: {
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
                                            type_meal: {
                                                type: "string",
                                                enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
                                                description: "Type of the meal"
                                            },
                                            meal: {
                                                type: "string",
                                                description: "Food item"
                                            },
                                            calories: {
                                                type: "integer",
                                                description: "Calories of the meal"
                                            },
                                            nutrients: {
                                                type: "object",
                                                properties: {
                                                    protein: {
                                                        type: "number",
                                                        description: "Protein content in grams"
                                                    },
                                                    carbs: {
                                                        type: "number",
                                                        description: "Carbohydrates content in grams"
                                                    },
                                                    fats: {
                                                        type: "number",
                                                        description: "Fats content in grams"
                                                    }
                                                },
                                                description: "Nutrients of the meal"
                                            }
                                        },
                                        required: ["type_meal", "meal", "calories", "nutrients"]
                                    }
                                }
                            },
                            required: ["day", "meals"]
                        }
                    }
                },
                required: ["days"]
            };

            const dietResponse = await axios.post(
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
                            preferences: userInfo.preferences,
                            allergies: userInfo.allergies,
                            targetCalories: targetCalories
                        })
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                }
            );

            console.log('API Response:', dietResponse.data);
            if (dietResponse.data.choices && dietResponse.data.choices.length > 0) {
                const choice = dietResponse.data.choices[0];
                console.log('Choice:', choice);
                if (choice.message && choice.message.function_call && choice.message.function_call.arguments) {
                    const argumentsContent = choice.message.function_call.arguments;
                    console.log('Arguments Content:', argumentsContent);
                    try {
                        const parsedContent = JSON.parse(argumentsContent);
                        setDietPlan(parsedContent);
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                        setDietMessage('Failed to parse diet plan.');
                    }
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
        } finally {
            setIsLoading(false); // Set loading state to false
        }
    };

    const handleSaveDiet = async () => {
        if (!dietName) {
            setDietMessage('Please enter a name for the diet.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            setDietMessage('User not logged in.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/user/saveDiet', {
                user_id: user.id,
                diet_name: dietName,
                diet_details: JSON.stringify(dietPlan)
            });
            setDietMessage('Diet saved successfully!');
            setDietName(''); 
            fetchUserDiets(user.id); 
        } catch (error) {
            console.error('Error saving diet:', error);
            setDietMessage('Failed to save diet.');
        }
    };

    const handleViewDiet = (dietId) => {
        navigate(`/view-diet/${dietId}`);
    };

    if (!isLoggedIn) {
        return <div className="centered">Must be logged in</div>;
    }

    return (
        <div className="container">
            <h1 className="infoHeader">Your Information</h1>
            <div className="formGroup">
                <label className="label">
                    Sex:
                    <select value={sex} onChange={(e) => setSex(e.target.value)} className="select">
                        <option value="">Select</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                    </select>
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Age:
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="input" min="0" max="99" />
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Height (cm):
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input" min="0" max="300" />
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Weight (kg):
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input" min="0" max="300" />
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Activity Level:
                    <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="select">
                        <option value="">Select</option>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly active">Lightly active</option>
                        <option value="Moderately active">Moderately active</option>
                        <option value="Very active">Very active</option>
                        <option value="Super active">Super active</option>
                    </select>
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Diet Goal:
                    <select value={dietGoal} onChange={(e) => setDietGoal(e.target.value)} className="select">
                        <option value="">Select</option>
                        <option value="Losing fat">Losing fat</option>
                        <option value="Gaining weight">Gaining weight</option>
                        <option value="Maintaining weight">Maintaining weight</option>
                        <option value="Building muscle">Building muscle</option>
                        <option value="Improving overall health">Improving overall health</option>
                    </select>
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Allergies:
                    <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} className="textarea" placeholder="I'm allergic to peanuts and nuts" />
                </label>
            </div>
            <div className="formGroup">
                <label className="label">
                    Preferences:
                    <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} className="textarea" placeholder="I really like bananas and strawberries, but no apples" />
                </label>
            </div>
            <button onClick={handleSaveInformation} className="button">Save</button>
            <h2 className="subHeader">Your Diets</h2>
            <ul className="dietList">
                {userDiets && userDiets.length > 0 ? (
                    userDiets.map((diet, index) => (
                        <li key={index} className="dietItem">
                            <span>[{diet.id}] {diet.diet_name}</span>
                            <button onClick={() => handleViewDiet(diet.id)} className="viewButton">View Diet</button>
                        </li>
                    ))
                ) : (
                    <li>No diets found.</li>
                )}
            </ul>
            <button onClick={handleCreateNewDiet} className="button">Create New Diet</button>
            {isLoading && <p className="dietMessage">Generating new diet...</p>} {/* Display loading message */}
            {dietPlan && dietPlan.days && (
                <div className="dietPlan">
                    <h2 className="subHeader">Diet Details</h2>
                    {dietPlan.days.map((day, dayIndex) => (
                        <div key={dayIndex} className="day">
                            <h3>Day {day.day}</h3>
                            <table className="dietTable">
                                <thead>
                                    <tr>
                                        <th>Type of Meal</th>
                                        <th>Meal</th>
                                        <th>Calories</th>
                                        <th>Protein (g)</th>
                                        <th>Carbs (g)</th>
                                        <th>Fats (g)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.meals.map((meal, mealIndex) => (
                                        <tr key={mealIndex}>
                                            <td>{meal.type_meal}</td>
                                            <td>{meal.meal}</td>
                                            <td>{meal.calories}</td>
                                            <td>{meal.nutrients.protein}</td>
                                            <td>{meal.nutrients.carbs}</td>
                                            <td>{meal.nutrients.fats}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    <div className="formGroup">
                        <label className="label">
                            Diet Name:
                            <input type="text" value={dietName} onChange={(e) => setDietName(e.target.value)} className="input" />
                        </label>
                    </div>
                    <button onClick={handleSaveDiet} className="button">Save Diet</button>
                </div>
            )}
            <p className="dietMessage">{dietMessage}</p>
        </div>
    );
}

export default Diets;