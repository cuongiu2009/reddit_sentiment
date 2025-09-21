const db = require('../services/db');

const Comment = {
  async bulkCreate(comments) {
    if (comments.length === 0) return [];

    const valuePlaceholders = [];
    const flatValues = [];
    let paramIndex = 1;

    comments.forEach((comment, index) => {
      valuePlaceholders.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
      flatValues.push(
        comment.parent_post_id,
        comment.text,
        comment.author || null, // Use null for optional fields
        comment.sentiment || 'neutral',
        comment.published_at ? comment.published_at.toISOString() : new Date().toISOString()
      );
    });

    const sql = `INSERT INTO comments (parent_post_id, text, author, sentiment, published_at) VALUES ${valuePlaceholders.join(',')} RETURNING id;`;
    const { rows } = await db.query(sql, flatValues);
    return rows.map(row => row.id);
  },

  async findByParentPostId(parent_post_id) {
    const sql = `SELECT * FROM comments WHERE parent_post_id = $1;`;
    const { rows } = await db.query(sql, [parent_post_id]);
    return rows;
  }
};

module.exports = Comment;