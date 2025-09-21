const db = require('../services/db');

const SentimentResult = {
  async create(job_id, positive_score, negative_score, neutral_score, net_score, word_cloud, timeline_data) {
    const sql = `INSERT INTO sentiment_results (job_id, positive_score, negative_score, neutral_score, net_score, word_cloud, timeline_data)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id;`;
    const { rows } = await db.query(sql, [
      job_id,
      positive_score,
      negative_score,
      neutral_score,
      net_score,
      JSON.stringify(word_cloud),
      JSON.stringify(timeline_data),
    ]);
    return rows[0].id;
  },

  async findByJobId(job_id) {
    const sql = `SELECT * FROM sentiment_results WHERE job_id = $1;`;
    const { rows } = await db.query(sql, [job_id]);
    return rows[0];
  },
};

module.exports = SentimentResult;