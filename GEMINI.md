# Gemini CLI Agent Context

This file provides context for the Gemini CLI agent to assist with development.

## Project Overview

You are working on a sentiment analysis application. The goal is to build a full-stack web application that allows users to analyze public sentiment on various topics from social media.

*   **Frontend:** A React single-page application built with `create-react-app`. The UI is prototyped in `sentiment_app_react_single_file.jsx`.
*   **Backend:** A Node.js and Express.js API that, given a topic, finds popular "parent" posts on social media and then crawls and analyzes the **comments** under those posts. It uses the Google Cloud Natural Language API for sentiment analysis and stores results in a PostgreSQL database.

## Key Technologies

*   **Backend:** Node.js, Express.js, PostgreSQL (`pg` library), Axios
*   **Frontend:** React, Tailwind CSS
*   **Testing:** Jest, React Testing Library, Supertest
*   **API Specification:** OpenAPI 3.0 (`specs/001-use-sentiment-app/contracts/openapi.yaml`)
*   **Data Model:** `specs/001-use-sentiment-app/data-model.md`

## Development Workflow

1.  **Tasks:** The development tasks are defined in `specs/001-use-sentiment-app/tasks.md`.
2.  **TDD:** Follow a Test-Driven Development approach. Write failing tests before writing implementation code.
3.  **Commits:** Make small, atomic commits that reference the task number from `tasks.md`.
