const express = require('express');
const router = express.Router();
const AnalysisJob = require('../../models/AnalysisJob');
const SentimentResult = require('../../models/SentimentResult');
const jobProcessor = require('../../services/jobProcessor');

router.post('/jobs', async (req, res) => {
  const { topic, sources, time_range, sort } = req.body; // Add sort

  if (!topic || !sources || !time_range || !sort) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const jobId = await AnalysisJob.create(topic, sources, time_range);
    jobProcessor.processJob(jobId, topic, sources, time_range, sort); // Pass sort

    res.status(202).json({ job_id: jobId });
  } catch (error) {
    console.error('Error creating analysis job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/jobs/:job_id', async (req, res) => {
  const { job_id } = req.params;

  try {
    const job = await AnalysisJob.findById(job_id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    let results = null;
    if (job.status === 'completed') {
      results = await SentimentResult.findByJobId(job.id);
    }

    res.status(200).json({
      job_id: job.id,
      topic: job.topic,
      sources: job.sources,
      time_range: job.time_range,
      status: job.status,
      created_at: job.created_at,
      completed_at: job.completed_at,
      results: results,
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
