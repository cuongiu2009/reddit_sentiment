const db = require('../services/db');

const AnalysisJob = {
  async create(topic, sources, time_range) {
    const sql = `INSERT INTO analysis_jobs (topic, sources, time_range, status)
                 VALUES ($1, $2, $3, 'pending')
                 RETURNING id;`;
    const { rows } = await db.query(sql, [topic, JSON.stringify(sources), time_range]);
    return rows[0].id;
  },

  async setStatus(id, status) {
    const sql = `UPDATE analysis_jobs SET status = $1 WHERE id = $2;`;
    await db.query(sql, [status, id]);
  },

  async markAsCompleted(id) {
    const sql = `UPDATE analysis_jobs SET status = 'completed', completed_at = NOW() WHERE id = $1;`;
    await db.query(sql, [id]);
  },

  async markAsFailed(id) {
    const sql = `UPDATE analysis_jobs SET status = 'failed', completed_at = NOW() WHERE id = $1;`;
    await db.query(sql, [id]);
  },

  async findById(id) {
    const sql = `SELECT * FROM analysis_jobs WHERE id = $1;`;
    const { rows } = await db.query(sql, [id]);
    return rows[0];
  },
};

module.exports = AnalysisJob;
