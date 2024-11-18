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
    storage: 'database.sqlite'
});

// Define a model for the user
const User = sequelize.define('User', {
    username: {
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
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const newUser = await User.create({ username, password, email });
        res.json({ message: 'User signed up successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up user', error });
    }
});

// Sign-in endpoint
app.post('/api/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username, password } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        req.session.user = user; // Create a session
        console.log('Session created:', req.session); // Log session data
        res.json({ message: 'Sign in successful!', user });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in user', error });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Sync and start the server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});