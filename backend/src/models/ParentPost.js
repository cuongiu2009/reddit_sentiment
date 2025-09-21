const db = require('../services/db');

const ParentPost = {
  async create(job_id, source, post_id, url, title, author) {
    const sql = `INSERT INTO parent_posts (job_id, source, post_id, url, title, author)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id;`;
    const { rows } = await db.query(sql, [job_id, source, post_id, url, title, author]);
    return rows[0].id;
  },

  async findByJobId(job_id) {
    const sql = `SELECT * FROM parent_posts WHERE job_id = $1;`;
    const { rows } = await db.query(sql, [job_id]);
    return rows;
  },

  async bulkCreate(parentPosts) {
    if (parentPosts.length === 0) return [];

    const values = parentPosts.map(post => `(${(post.job_id)}, '${post.source}', '${post.post_id}', '${post.url || ''}', '${post.title || ''}', '${post.author || ''}')`).join(',');
    const sql = `INSERT INTO parent_posts (job_id, source, post_id, url, title, author) VALUES ${values} RETURNING id;`;
    const { rows } = await db.query(sql);
    return rows.map(row => row.id);
  }
};

module.exports = ParentPost;
