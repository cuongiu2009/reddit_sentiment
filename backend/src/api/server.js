const express = require('express');
const cors = require('cors'); // Import cors
const jobsRouter = require('./routes/jobs');

const app = express();

app.use(express.json());
app.use(cors()); // Use cors middleware

// API routes
app.use('/api/v1', jobsRouter);

// Export the app for testing
module.exports = app;

// Start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}