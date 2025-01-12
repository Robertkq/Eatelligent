import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Diets.css';

const ViewDiet = () => {
    const { dietId } = useParams();
    const [diet, setDiet] = useState(null);
    const [dietMessage, setDietMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/diet/${dietId}`);
                console.log('API Response:', response.data); 

                const parsedDietDetails = JSON.parse(response.data.diet_details);
                console.log('Parsed Diet Details:', parsedDietDetails); 

                setDiet({ ...response.data, diet_details: parsedDietDetails });
            } catch (error) {
                console.error('Error fetching diet:', error);
                setDietMessage('Failed to fetch diet.');
            }
        };

        fetchDiet();
    }, [dietId]);

    useEffect(() => {
        if (diet) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || user.id !== diet.user_id) {
                setDietMessage('You are not authorized to view this diet.');
                navigate('/diets'); 
            }
        }
    }, [diet, navigate]);

    if (!diet) {
        return <div className="centered">Loading...</div>;
    }

    if (!diet.diet_details || !diet.diet_details.days) {
        return <div className="centered">No diet details available.</div>;
    }

    return (
        <div className="container">
            <button onClick={() => navigate('/diets')} className="button">Go Back</button>
            <h1 className="header">Diet Details</h1>
            {diet.diet_details.days.map((day, dayIndex) => (
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
            <p className="dietMessage">{dietMessage}</p>
        </div>
    );
}

export default ViewDiet;