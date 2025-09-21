# Data Model

This document defines the data structures for the Sentiment Analysis application, based on the corrected workflow of analyzing comments from parent posts.

## Tables

### `analysis_jobs`

Stores information about each analysis request made by a user.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the job. |
| `topic` | `VARCHAR(255)` | `NOT NULL` | The topic or keyword for the analysis. |
| `sources` | `JSONB` | `NOT NULL` | The social media sources selected for the analysis (e.g., `["twitter", "reddit"]`). |
| `time_range` | `VARCHAR(50)` | `NOT NULL` | The time range for the analysis (e.g., "7d"). |
| `status` | `VARCHAR(50)` | `NOT NULL` | The current status of the job (e.g., "pending", "running", "completed", "failed"). |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp when the job was created. |
| `completed_at` | `TIMESTAMP` | | Timestamp when the job was completed. |

### `parent_posts`

Stores the top-level posts that were identified as sources for comments for a specific job.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the parent post record. |
| `job_id` | `INTEGER` | `FOREIGN KEY (analysis_jobs.id)` | The analysis job this post belongs to. |
| `source` | `VARCHAR(50)` | `NOT NULL` | The social media platform (e.g., "twitter"). |
| `post_id` | `VARCHAR(255)` | `NOT NULL` | The unique ID of the post on its platform. |
| `url` | `VARCHAR(2048)` | | A URL to the original post. |
| `title` | `TEXT` | | The title or main text of the post. |
| `author` | `VARCHAR(255)` | | The author of the post. |

### `comments`

Stores individual comments collected from the `parent_posts`. This is the data that will be analyzed.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the comment. |
| `parent_post_id` | `INTEGER` | `FOREIGN KEY (parent_posts.id)` | The parent post this comment was collected from. |
| `text` | `TEXT` | `NOT NULL` | The content of the comment. |
| `author` | `VARCHAR(255)` | | The author of the comment. |
| `sentiment` | `VARCHAR(50)` | | The sentiment of this comment. |
| `published_at` | `TIMESTAMP` | | Timestamp when the comment was published. |

### `sentiment_results`

Stores the high-level results of a completed analysis job.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the result. |
| `job_id` | `INTEGER` | `FOREIGN KEY (analysis_jobs.id)` | The analysis job that this result belongs to. |
| `positive_score` | `FLOAT` | `NOT NULL` | The percentage of positive sentiment (0-100). |
| `negative_score` | `FLOAT` | `NOT NULL` | The percentage of negative sentiment (0-100). |
| `neutral_score` | `FLOAT` | `NOT NULL` | The percentage of neutral sentiment (0-100). |
| `net_score` | `FLOAT` | `NOT NULL` | The overall sentiment score. |
| `word_cloud` | `JSONB` | | A JSON object representing the top words and their frequencies (e.g., `{"love": 120, "great": 83}`). |
| `timeline_data` | `JSONB` | | A JSON array of sentiment data over time (e.g., `[{"t": "2025-09-10", "p": 10, "n": 2}]`). |