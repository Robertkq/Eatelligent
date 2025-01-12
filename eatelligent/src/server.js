const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 5000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    dialectOptions: {
        timeout: 30000 // Increase timeout to 30 seconds
    }
});

// Define a model for the user
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// Define a model for user information
const UserInformation = sequelize.define('UserInformation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure user_id is unique
        references: {
            model: User,
            key: 'id'
        }
    },
    sex: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER
    },
    height: {
        type: DataTypes.INTEGER
    },
    weight: {
        type: DataTypes.INTEGER
    },
    diet_type: {
        type: DataTypes.STRING
    },
    diet_goal: {
        type: DataTypes.STRING
    },
    allergies: {
        type: DataTypes.TEXT
    },
    preferences: {
        type: DataTypes.TEXT
    },
    activity_level: {
        type: DataTypes.STRING // Add activity level field
    }
});

// Define a model for diets
const Diet = sequelize.define('Diet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    diet_name: {
        type: DataTypes.STRING
    },
    diet_details: {
        type: DataTypes.TEXT
    }
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow credentials (cookies)
}));
app.use(session({
    secret: 'strong_password',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Eatelligent API');
});

// Sign-up endpoint
app.post('/api/signup', async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = await User.create({ name, password, email });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        console.error(error.stack);
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// Sign-in endpoint
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email, password } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Failed to sign in', error });
    }
});

// Save user information endpoint
app.post('/api/user/save', async (req, res) => {
    const { user_id, sex, age, height, weight, dietType, dietGoal, allergies, preferences, activity_level } = req.body;
    try {
        const [userInfo, created] = await UserInformation.upsert({
            user_id,
            sex,
            age,
            height,
            weight,
            diet_type: dietType,
            diet_goal: dietGoal,
            allergies,
            preferences,
            activity_level // Save activity level
        });
        res.status(200).json({ message: 'User information saved successfully', userInfo });
    } catch (error) {
        console.error('Error saving user information:', error);
        console.error(error.stack);
        res.status(500).json({ message: 'Failed to save user information', error });
    }
});

// Fetch user diets endpoint
app.get('/api/user/diets', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const diets = await Diet.findAll({ where: { user_id } });
        res.status(200).json(diets);
    } catch (error) {
        console.error('Error fetching user diets:', error);
        res.status(500).json({ message: 'Failed to fetch user diets', error });
    }
});

// Fetch user information endpoint
app.get('/api/user/info', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const userInfo = await UserInformation.findOne({ where: { user_id } });
        if (!userInfo) {
            return res.status(404).json({ message: 'User information not found' });
        }
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Failed to fetch user information', error });
    }
});

// Save diet endpoint
app.post('/api/user/saveDiet', async (req, res) => {
    const { user_id, diet_name, diet_details } = req.body;
    if (!user_id || !diet_name || !diet_details) {
        return res.status(400).json({ message: 'User ID, diet name, and diet details are required' });
    }

    try {
        const diet = await Diet.create({
            user_id,
            diet_name,
            diet_details
        });
        res.status(201).json({ message: 'Diet saved successfully', diet });
    } catch (error) {
        console.error('Error saving diet:', error);
        res.status(500).json({ message: 'Failed to save diet', error });
    }
});

// Fetch a specific diet endpoint
app.get('/api/user/diet/:dietId', async (req, res) => {
    const { dietId } = req.params;
    try {
        const diet = await Diet.findByPk(dietId);
        if (!diet) {
            return res.status(404).json({ message: 'Diet not found' });
        }
        res.status(200).json(diet);
    } catch (error) {
        console.error('Error fetching diet:', error);
        res.status(500).json({ message: 'Failed to fetch diet', error });
    }
});

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Unable to sync database:', error);
});