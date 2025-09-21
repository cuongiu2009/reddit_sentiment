-- T003: Create Database Schema Migration

CREATE TABLE analysis_jobs (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    sources JSONB NOT NULL,
    time_range VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE parent_posts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    url VARCHAR(2048),
    title TEXT,
    author VARCHAR(255)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    parent_post_id INTEGER REFERENCES parent_posts(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    author VARCHAR(255),
    sentiment VARCHAR(50),
    published_at TIMESTAMP
);

CREATE TABLE sentiment_results (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    positive_score FLOAT NOT NULL,
    negative_score FLOAT NOT NULL,
    neutral_score FLOAT NOT NULL,
    net_score FLOAT NOT NULL,
    word_cloud JSONB,
    timeline_data JSONB
);
