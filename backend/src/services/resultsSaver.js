const SentimentResult = require('../models/SentimentResult');

const resultsSaver = {
  async saveResults(jobId, analyzedComments) {
    console.log(`[Results Saver] Saving results for Job ID: ${jobId}`);

    // Aggregate sentiment scores
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    analyzedComments.forEach(comment => {
      if (comment.sentiment === 'positive') {
        positiveCount++;
      } else if (comment.sentiment === 'negative') {
        negativeCount++;
      } else {
        neutralCount++;
      }
    });

    const totalComments = analyzedComments.length;
    const positive_score = totalComments > 0 ? (positiveCount / totalComments) * 100 : 0;
    const negative_score = totalComments > 0 ? (negativeCount / totalComments) * 100 : 0;
    const neutral_score = totalComments > 0 ? (neutralCount / totalComments) * 100 : 0;

    // Simple net score calculation (can be refined)
    const net_score = (positive_score - negative_score) / 100; // Between -1 and 1

    // Mock word cloud and timeline data for now
    const word_cloud = { 'mock_word_1': 10, 'mock_word_2': 5 };
    const timeline_data = [{ t: new Date().toISOString().split('T')[0], p: positive_score, n: negative_score }];

    await SentimentResult.create(
      jobId,
      positive_score,
      negative_score,
      neutral_score,
      net_score,
      word_cloud,
      timeline_data
    );
    console.log(`[Results Saver] Results saved for Job ID: ${jobId}`);
  },
};

module.exports = resultsSaver;
