const fs = require('fs');
const path = require('path');
const db = require('./db');
const AnalysisJob = require('../models/AnalysisJob');
const crawler = require('./crawler');
const analyzer = require('./analyzer');
const resultsSaver = require('./resultsSaver');

const jobProcessor = {
  async processJob(jobId, topic, sources, time_range, sort) { // Add sort
    console.log(`[Job Processor] Starting processing for Job ID: ${jobId}`);
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      await AnalysisJob.setStatus(jobId, 'running');

      const structuredResults = await crawler.crawlComments(topic, sources, time_range, sort); // Pass sort
      console.log(`[Job Processor] Found ${structuredResults.length} parent posts with their comments.`);

      const allComments = structuredResults.flatMap(result => result.comments);

      if (allComments.length === 0) {
        console.log(`[Job Processor] No comments found for Job ID: ${jobId}. Marking as completed with no results.`);
        await AnalysisJob.markAsCompleted(jobId);
        await client.query('COMMIT');
        return;
      }

      const analyzedComments = await analyzer.analyzeSentiment(allComments);
      console.log(`[Job Processor] Analyzed ${analyzedComments.length} comments.`);

      const debugResults = structuredResults.map(result => {
        const commentsForThisPost = analyzedComments.filter(
          c => result.comments.some(origComment => origComment.text === c.text && origComment.author === c.author)
        );
        return {
          parentPost: result.parentPost,
          comments: commentsForThisPost,
        };
      });

      const debugData = {
        jobId: jobId,
        topic: topic,
        results: debugResults,
      };
      const jsonOutputPath = path.join(__dirname, `../../job_${jobId}_results.json`);
      fs.writeFileSync(jsonOutputPath, JSON.stringify(debugData, null, 2));
      console.log(`[Job Processor] DEBUG: Detailed results for Job ID ${jobId} saved to ${jsonOutputPath}`);

      await resultsSaver.saveResults(jobId, analyzedComments);

      await AnalysisJob.markAsCompleted(jobId);

      await client.query('COMMIT');
      console.log(`[Job Processor] Job ID: ${jobId} completed and committed successfully.`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[Job Processor] Error processing Job ID: ${jobId}. Transaction rolled back.`, error);
      await AnalysisJob.markAsFailed(jobId);
    } finally {
      client.release();
    }
  },
};

module.exports = jobProcessor;