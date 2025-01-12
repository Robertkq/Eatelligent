﻿## About the Project

Eatelligent is a web application designed to provide personalized diet plans and nutritional guidance. The application leverages modern web technologies to deliver a seamless user experience. Below is a detailed description of the technical stack and architecture of the project.

### Frontend

The frontend of the application is built using **React**. The key components and pages include:

- **Home Page**: Welcomes users to the platform and provides an overview of the services offered.
- **Sign Up Page**: Allows new users to create an account by providing their name, email, and password.
- **Sign In Page**: Enables existing users to log in to their accounts.
- **Diets Page**: Displays user-specific diet plans and allows users to create new diet plans.
- **About Page**: Provides information about the platform, its mission, and features.
- **View Diet Page**: Shows detailed information about a specific diet plan.

The frontend communicates with the backend server using **Axios** for making HTTP requests.

### Backend

The backend of the application is built using **Node.js** and **Express**. The backend server handles various tasks, including:

- **User Authentication**: Manages user sign-up, sign-in, and session management using **express-session**.
- **Diet Plan Management**: Handles the creation, retrieval, and storage of personalized diet plans.
- **Database Interaction**: Communicates with the database to store and retrieve user information and diet plans.

### Database

The application uses **SQLite** as the database for storing user information and diet plans. In the future, the project plans to migrate to a more robust database system like **PostgreSQL** or **MongoDB** to handle larger datasets and provide better performance.

### API Endpoints

The backend server exposes several API endpoints to handle various operations:

- **POST /api/signup**: Creates a new user account.
- **POST /api/signin**: Authenticates an existing user.
- **GET /api/user/diets**: Retrieves the diet plans for a specific user.
- **POST /api/user/save**: Saves user information.
- **POST /api/user/saveDiet**: Saves a new diet plan for a user.
- **GET /api/user/diet/:dietId**: Retrieves detailed information about a specific diet plan.

### Additional Features

- **Responsive Design**: The application is designed to be responsive and works well on both desktop and mobile devices.
- **User Preferences and Allergies**: Users can specify their dietary preferences and allergies, which are taken into account when generating diet plans.
- **Nutritional Information**: Each meal in the diet plan includes detailed nutritional information, such as calories, protein, carbs, and fats.

### Future Plans

- **Database Improvement**: Migrate to a more robust database system like PostgreSQL or MongoDB.
- **CSS Optimization**: Refactor the CSS to reduce redundancy and improve maintainability.
- **Adding Tests**: Add more unit and integration tests to ensure the reliability and stability of the application.

## Contact

If you have any questions or need support, feel free to reach out to us at:

- Email: [robert.vuia10@e-uvt.ro]
- Email: [darius.trica03@e-uvt.ro]