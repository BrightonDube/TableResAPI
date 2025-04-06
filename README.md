# Restaurant Reservation API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  <!-- Optional: Add your license badge if you choose a license -->

## Description

This API provides a backend service for managing table reservations for a restaurant. It allows authorized restaurant staff to create, view, update, and manage table reservations efficiently.  The API is built using Node.js, Express.js, and MongoDB, and incorporates Google Authentication for secure access.

## Features

*   **Table Management:**
    *   Create, retrieve, update, and delete restaurant tables.
*   **Reservation Management:**
    *   Create, retrieve, update, and delete table reservations.
    *   Update reservation status (e.g., Pending, Confirmed, Seated, Cancelled).
*   **User Authentication:**
    *   Secure login using Google Authentication via OAuth 2.0.
    *   Protected API routes requiring authentication for access.
*   **Restaurant Information Management:**
    *   Retrieve and update general restaurant information (name, address, phone, etc.).
*   **Data Validation:**
    *   Robust data validation on all API endpoints to ensure data integrity.
    *   Clear error responses for invalid requests.
*   **Error Handling:**
    *   Comprehensive error handling throughout the API for consistent and informative responses.
*   **API Documentation:**
    *   Interactive API documentation generated using Swagger/OpenAPI, available at `/api-docs` endpoint.

## Technologies Used

*   **Backend:**
    *   [Node.js](https://nodejs.org/) - JavaScript runtime environment
    *   [Express.js](https://expressjs.com/) - Web application framework for Node.js
*   **Database:**
    *   [MongoDB](https://www.mongodb.com/) - NoSQL database
    *   [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
*   **Authentication:**
    *   [Passport.js](http://www.passportjs.org/) - Authentication middleware for Node.js
    *   [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20) - Passport strategy for Google OAuth 2.0
    *   [express-session](https://www.npmjs.com/package/express-session) - Middleware for session management
*   **Data Validation:**
    *   [Joi](https://joi.dev/) - JavaScript object schema validation
*   **API Documentation:**
    *   [Swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) - OpenAPI/Swagger specification generator
    *   [Swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Serve Swagger UI for Express.js
*   **Templating Engine (Frontend - Optional):**
    *   [EJS](https://ejs.co/) - Embedded JavaScript templates (for basic frontend, if implemented)
*   **Environment Variables:**
    *   [dotenv](https://www.npmjs.com/package/dotenv) - Load environment variables from `.env` file

## Getting Started

These instructions will guide you on how to set up and run the Restaurant Reservation API on your local machine for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18 or later recommended)
*   [npm](https://www.npmjs.com/) (Node Package Manager, usually comes with Node.js)
*   [MongoDB](https://www.mongodb.com/) - Ensure MongoDB is installed and running locally or you have access to a MongoDB Atlas cluster.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_REPOSITORY_URL]  # Replace with your repository URL
    cd restaurant-reservation-api
    ```

2.  **Install npm dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    *   Create a `.env` file in the root of your project directory.
    *   Add the following environment variables to your `.env` file, replacing the placeholder values with your actual credentials:

        ```env
        MONGODB_URI=mongodb://localhost:27017/restaurant_reservation_db  # Or your MongoDB Atlas connection string
        GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
        GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
        GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
        SESSION_SECRET=<YOUR_STRONG_SESSION_SECRET> # Generate a strong secret!
        PORT=3000 # Optional: Customize the port
        ```

        **Important:**
        *   Obtain your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from the [Google Cloud Console](https://console.cloud.google.com/).
        *   Set up your "Authorized redirect URIs" in Google Cloud Console to `http://localhost:3000/auth/google/callback` (for local development).
        *   Replace `<YOUR_STRONG_SESSION_SECRET>` with a truly random and long string for session security (you can generate one using the provided script or online tools).
        *   Adjust `MONGODB_URI` to your MongoDB connection string (local or Atlas).

### Running the API Server

```bash
node server.js
