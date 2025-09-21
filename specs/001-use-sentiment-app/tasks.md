# Tasks for Sentiment Analysis Application

This task list is generated from the design artifacts and is ordered by dependency.

## Phase 1: Backend Setup

*   **T001: Set up Backend Project Structure**
    *   **File**: `backend/package.json`
    *   **Instructions**: Initialize a new Node.js project, and install initial dependencies: `express`, `pg`, `axios`, `dotenv`.

*   **T002: Configure Database Connection**
    *   **File**: `backend/src/services/db.js`
    *   **Instructions**: Create a PostgreSQL connection module using the `pg` library. It should read connection details from environment variables.

*   **T003: Create Database Schema Migration**
    *   **File**: `backend/migrations/001_initial_schema.sql`
    *   **Instructions**: Write the SQL script to create the `analysis_jobs`, `parent_posts`, `comments`, and `sentiment_results` tables as defined in `data-model.md`.

## Phase 2: Core Models

*   **T004: Create AnalysisJob Model [P]**
    *   **File**: `backend/src/models/AnalysisJob.js`
    *   **Instructions**: Implement a class or object to handle database operations for the `analysis_jobs` table (create, update status, find by ID).

*   **T005: Create ParentPost Model [P]**
    *   **File**: `backend/src/models/ParentPost.js`
    *   **Instructions**: Implement a class or object to handle database operations for the `parent_posts` table (create, find by job ID).

*   **T006: Create Comment Model [P]**
    *   **File**: `backend/src/models/Comment.js`
    *   **Instructions**: Implement a class or object to handle database operations for the `comments` table (bulk create).

*   **T007: Create SentimentResult Model [P]**
    *   **File**: `backend/src/models/SentimentResult.js`
    *   **Instructions**: Implement a class or object to handle database operations for the `sentiment_results` table (create).

## Phase 3: API Contract Tests

*   **T008: Write Contract Test for POST /jobs [P]**
    *   **File**: `backend/tests/contract/jobs.test.js`
    *   **Instructions**: Using `supertest`, write a test that sends a valid request to the `POST /jobs` endpoint and asserts a `202 Accepted` response. This test will fail initially.

*   **T009: Write Contract Test for GET /jobs/{job_id} [P]**
    *   **File**: `backend/tests/contract/jobs.test.js`
    *   **Instructions**: Using `supertest`, write a test for the `GET /jobs/{job_id}` endpoint. Test for a `200 OK` response for a completed job and a `404 Not Found` for a non-existent job. This test will fail initially.

## Phase 4: API Implementation

*   **T010: Set up Express Server and API Router**
    *   **File**: `backend/src/api/server.js`
    *   **Instructions**: Create the main Express application. Set up middleware for JSON parsing and CORS. Create a router for the `/api/v1` endpoints.

*   **T011: Implement POST /jobs Endpoint**
    *   **File**: `backend/src/api/routes/jobs.js`
    *   **Instructions**: Implement the route handler for `POST /jobs`. It should accept a request, create a new `analysis_jobs` record in the database with a "pending" status, and trigger the analysis job to run in the background. It should return the new `job_id`.

*   **T012: Implement GET /jobs/{job_id} Endpoint**
    *   **File**: `backend/src/api/routes/jobs.js`
    *   **Instructions**: Implement the route handler for `GET /jobs/{job_id}`. It should query the database for the job status and, if completed, join with the `sentiment_results` table to return the full result.

## Phase 5: Core Service Logic

*   **T013: Create Job Processing Service**
    *   **File**: `backend/src/services/jobProcessor.js`
    *   **Instructions**: Create the main service that orchestrates an analysis job. It will be called by the `POST /jobs` endpoint. This service will sequentially call the crawler, analyzer, and results saver.

*   **T014: Create Social Media Crawler Service**
    *   **File**: `backend/src/services/crawler.js`
    *   **Instructions**: Implement the two-step crawling logic. **Start by building the connector for Reddit** in `crawlers/reddit.js`. The service must have a modular design to allow adding more sources like Twitter and YouTube later.

*   **T015: Create Sentiment Analysis Service**
    *   **File**: `backend/src/services/analyzer.js`
    *   **Instructions**: Create a service that takes a list of comments, batches them, and sends them to the Google Cloud Natural Language API. It should handle the API response and return the sentiment for each comment.

*   **T016: Create Results Saver Service**
    *   **File**: `backend/src/services/resultsSaver.js`
    *   **Instructions**: Create a service that takes the analyzed comments, aggregates the results (calculates percentages, net score, word cloud), and saves the final summary to the `sentiment_results` table in the database.

## Phase 6: Frontend Integration

*   **T017: Create API Service on Frontend [P]**
    *   **File**: `frontend/src/services/api.js`
    *   **Instructions**: Create a service to communicate with the backend API. It should have functions to `createJob(topic, sources, time_range)` and `getJobStatus(jobId)`.

*   **T018: Connect Frontend UI to API Service**
    *   **File**: `frontend/src/components/SentimentApp.jsx`
    *   **Instructions**: Modify the component to call the `api.js` service. When the "Analyze" button is clicked, it should call `createJob`. It should then poll the `getJobStatus` endpoint periodically to check for results and update the UI accordingly.

## Parallel Execution Example

The following tasks can be run in parallel as they do not have dependencies on each other:

*   `T004: Create AnalysisJob Model [P]`
*   `T005: Create ParentPost Model [P]`
*   `T006: Create Comment Model [P]`
*   `T007: Create SentimentResult Model [P]`
*   `T008: Write Contract Test for POST /jobs [P]`
*   `T009: Write Contract Test for GET /jobs/{job_id} [P]`
*   `T017: Create API Service on Frontend [P]`
