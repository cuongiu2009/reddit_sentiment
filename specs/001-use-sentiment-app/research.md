# Research & Decisions

This document records the research and decisions made to resolve the `NEEDS CLARIFICATION` items in the implementation plan.

## 1. AI/ML Library for Sentiment Analysis

*   **Decision:** We will prioritize using the **Hugging Face Inference API**. The Google Cloud Natural Language API will be evaluated as a fallback option.
*   **Rationale:**
    *   Per user preference, starting with an open-source ecosystem like Hugging Face is desired.
    *   The Hugging Face Inference API provides a free tier that is suitable for initial development and launch, with limits based on request rates.
    *   This approach allows us to validate the model quality for Vietnamese sentiment analysis before committing. The final choice will be made during implementation based on real-world test results.
*   **Alternatives considered:**
    *   **Google Cloud Natural Language API:** This remains a strong fallback option due to its generous free tier (based on character volume) and high reliability.
    *   **Self-hosting an open-source model:** Rejected due to the significant increase in hosting costs and development complexity, which conflicts with the project's budget goals.

## 2. Database for Storing Results

*   **Decision:** We will use **PostgreSQL**.
*   **Rationale:**
    *   It is a powerful, open-source relational database that can easily handle the structured data of our analysis jobs and results.
    *   It has excellent support in the Node.js ecosystem (e.g., with the `pg` library).
    *   It can scale to meet future needs.
*   **Alternatives considered:**
    *   **MongoDB (NoSQL):** Rejected because our data model is well-defined and relational, making a SQL database a better fit.
    *   **SQLite:** Rejected because we need a more robust, concurrent database for a web application.

## 3. Performance, Constraints, and Scale

*   **Decision:**
    *   **Performance Goals:**
        *   API endpoints (excluding analysis jobs) should have a p99 response time of **< 500ms**.
        *   A standard sentiment analysis job (crawling up to 1000 posts) should complete in **under 2 minutes**.
    *   **Constraints:**
        *   Monthly cost for all third-party APIs (Google Cloud NLP, Social Media APIs) should not exceed **$200** during the initial phase. This will be monitored closely.
    *   **Scale/Scope:**
        *   The system will be designed to support up to **10 concurrent users** and **100 analysis jobs per hour**.
*   **Rationale:** These are reasonable starting points for a new application. They provide clear targets for development and testing, and can be revisited as the user base grows.
*   **Alternatives considered:** None, as these are initial estimates that need to be based on real-world usage data later.