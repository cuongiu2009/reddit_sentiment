# Quickstart

This guide provides instructions on how to set up and run the Sentiment Analysis application.

## Prerequisites

*   Node.js v20.x
*   npm / yarn
*   Docker and Docker Compose
*   Access to Google Cloud Platform with the Natural Language API enabled.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    # PostgreSQL settings
    DB_USER=your_db_user
    DB_HOST=db
    DB_DATABASE=sentiment_app
    DB_PASSWORD=your_db_password
    DB_PORT=5432

    # Google Cloud settings
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json

    # Social Media API Keys (add as needed)
    TWITTER_API_KEY=...
    ```

3.  **Install dependencies:**
    ```bash
    # In the root directory
    npm install
    ```

## Running the Application

1.  **Start the services:**
    ```bash
    docker-compose up -d
    ```
    This will start the PostgreSQL database and the backend service.

2.  **Start the frontend:**
    ```bash
    # In a new terminal, from the root directory
    npm run start
    ```
    The application will be available at `http://localhost:3000`.

## Running Tests

*   **Backend tests:**
    ```bash
    # From the backend directory
    npm test
    ```

*   **Frontend tests:**
    ```bash
    # From the frontend directory
    npm test
    ```
