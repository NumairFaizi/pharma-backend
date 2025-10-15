# Pharma Backend API

## About The Project

The Pharma Backend API is a robust Node.js and Express.js application designed to power an e-learning or content management platform. It provides a comprehensive set of RESTful endpoints for managing users, courses, batches, and lectures, including secure user authentication and video lecture uploads.

This backend serves as the core data and business logic layer, enabling functionalities such as user registration and login, retrieval of course information, management of educational batches, and the ability to add, update, and delete lecture content with associated video files.

### Key Features

*   **User Authentication**: Secure user registration and login using `bcrypt` for password hashing and `jsonwebtoken` (JWT) for session management.
*   **Course Management**: API endpoints to retrieve a list of all courses and details of a specific course.
*   **Batch Management**: API endpoints to retrieve a list of all available batches.
*   **Lecture Management**:
    *   Retrieve all lectures associated with a specific course.
    *   Add new lectures, including video file uploads using `multer`.
    *   Update lecture titles.
    *   Delete lectures, with associated video files being removed from the server.
*   **PostgreSQL Database**: Persistent storage for all application data.
*   **RESTful API**: Clean and consistent API design for easy integration with frontend applications.
*   **Environment Configuration**: Utilizes `dotenv` for managing sensitive configuration details.
*   **CORS Enabled**: Configured to handle Cross-Origin Resource Sharing.

### Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
*   **PostgreSQL**: Powerful, open-source object-relational database system.
*   **`pg`**: Node.js driver for PostgreSQL.
*   **`dotenv`**: Loads environment variables from a `.env` file.
*   **`bcrypt`**: Library for hashing passwords.
*   **`jsonwebtoken`**: Implements JSON Web Tokens for secure authentication.
*   **`multer`**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **`cors`**: Provides a Connect/Express middleware that can be used to enable CORS with various options.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: (v18 or higher recommended)
    *   [Download Node.js](https://nodejs.org/)
*   **npm**: (Comes with Node.js)
*   **PostgreSQL**:
    *   [Download PostgreSQL](https://www.postgresql.org/download/)
    *   Alternatively, use Docker for a PostgreSQL instance.

### Installation

1.  **Clone the repository**:

    bash
    git clone https://github.com/yourusername/pharma-backend.git
    cd pharma-backend
    

2.  **Install NPM packages**:

    bash
    npm install
    

3.  **Set up environment variables**:
    Create a `.env` file in the root of the project by copying `.sample.env` and filling in your details:

    bash
    cp .sample.env .env
    

    Open `.env` and configure the following:

    
    # Server
    PORT=5000

    # PostgreSQL
    DB_USER=your_pg_username
    DB_PASS=your_pg_password
    DB_HOST=localhost
    DB_NAME=your_database_name
    DB_PORT=5432 # Optional, defaults to 5432
    DB_SSL=false # Set to true if using SSL/TLS for DB connection

    # JWT
    JWT_SECRET=yourSuperSecretKey123 # Use a strong, unique secret key
    

4.  **Database Setup**:
    Connect to your PostgreSQL server and create a new database with the name you specified in `DB_NAME` (e.g., `your_database_name`).

    Then, create the necessary tables. You can use a tool like `psql` or `pgAdmin` to run the following SQL commands:

    sql
    -- Create users table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create batches table
    CREATE TABLE batches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create courses table
    CREATE TABLE courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        thumbnail_url VARCHAR(255), -- Assuming courses might have thumbnails
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create lectures table
    CREATE TABLE lectures (
        id SERIAL PRIMARY KEY,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(255) NOT NULL, -- Path to the uploaded video file
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );
    

5.  **Create Uploads Directory**:
    The application saves video uploads to `uploads/videos`. Create this directory in the root of your project:

    bash
    mkdir -p uploads/videos
    

## Usage

### Running the Server

To start the backend server, run the following command from the project root:

bash
npm start


The server will typically run on `http://localhost:5000` (or the `PORT` specified in your `.env` file). You should see a "Connected to PostgreSQL" message in your console if the database connection is successful.

### API Endpoints

All API endpoints are prefixed with `/api`.

#### 1. User Management (`/api/users`)

*   **Register a new user**
    *   `POST /api/users/register`
    *   **Body**: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "securePassword123" }`
    *   **Response**: `{ "id": 1, "name": "John Doe", "email": "john.doe@example.com" }`

*   **Log in a user**
    *   `POST /api/users/login`
    *   **Body**: `{ "email": "john.doe@example.com", "password": "securePassword123" }`
    *   **Response**: `{ "token": "jwt_token_string", "user": { "id": 1, "name": "John Doe", "email": "john.doe@example.com" } }`

#### 2. Batch Management (`/api/batches`)

*   **Get all batches**
    *   `GET /api/batches`
    *   **Response**: `[ { "id": 1, "name": "Summer 2023 Batch", ... }, ... ]`

#### 3. Course Management (`/api/courses`)

*   **Get all courses**
    *   `GET /api/courses`
    *   **Response**: `[ { "id": 1, "title": "Introduction to Pharmacology", ... }, ... ]`

*   **Get course by ID**
    *   `GET /api/courses/:id` (e.g., `/api/courses/1`)
    *   **Response**: `{ "id": 1, "title": "Introduction to Pharmacology", ... }`

#### 4. Lecture Management (`/api/lectures`)

*   **Get lectures by course ID**
    *   `GET /api/lectures/:courseId` (e.g., `/api/lectures/1`)
    *   **Response**: `[ { "id": 101, "course_id": 1, "title": "Lecture 1: Basics", "video_url": "/uploads/videos/16789012345.mp4" }, ... ]`

*   **Add a new lecture to a course**
    *   `POST /api/lectures/:courseId` (e.g., `/api/lectures/1`)
    *   **Content-Type**: `multipart/form-data`
    *   **Body**:
        *   `title`: (Form Field) "New Lecture Title"
        *   `video`: (File Field) `your_lecture_video.mp4`
    *   **Response**: `{ "id": 102, "course_id": 1, "title": "New Lecture Title", "video_url": "/uploads/videos/timestamp.mp4" }`

*   **Update a lecture's title**
    *   `PUT /api/lectures/:id` (e.g., `/api/lectures/101`)
    *   **Body**: `{ "title": "Updated Lecture Title" }`
    *   **Response**: `{ "id": 101, "course_id": 1, "title": "Updated Lecture Title", "video_url": "/uploads/videos/..." }`

*   **Delete a lecture**
    *   `DELETE /api/lectures/:id` (e.g., `/api/lectures/101`)
    *   **Response**: `{ "message": "Lecture deleted successfully" }` (and the associated video file will be removed from `uploads/videos`)
