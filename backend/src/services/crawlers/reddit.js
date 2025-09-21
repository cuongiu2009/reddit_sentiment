const axios = require('axios');
const { URLSearchParams } = require('url');
require('dotenv').config({ path: '../../.env' });

const reddit = {
  async getAccessToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    let attempts = 0;
    while (attempts < 3) {
      try {
        const response = await axios.post(
          'https://www.reddit.com/api/v1/access_token',
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
              'User-Agent': 'SentimentAnalysisApp/1.0 by /u/cuongiu2009'
            },
          }
        );
        return response.data.access_token;
      } catch (error) {
        attempts++;
        console.error(`[Reddit Crawler] Attempt ${attempts} to get access token failed. Retrying in 2 seconds...`, error.message);
        if (attempts >= 3) {
          throw error; // Rethrow error after final attempt
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }
  },

  async searchSubreddits(topic) {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `https://oauth.reddit.com/subreddits/search?q=${topic}&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'SentimentAnalysisApp/1.0 by /u/cuongiu2009'
        },
      }
    );
    return response.data.data.children.map(sub => sub.data.display_name);
  },

  async findTopPostsInSubreddit(subreddit, topic, timeRange, sort) {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/search?q=${topic}&sort=${sort}&t=${timeRange}&restrict_sr=on&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'SentimentAnalysisApp/1.0 by /u/cuongiu2009'
        },
      }
    );
    return response.data.data.children.map(child => ({
      id: child.data.id,
      source: 'reddit',
      url: `https://www.reddit.com${child.data.permalink}`,
      title: child.data.title,
      author: child.data.author,
    }));
  },

  async getComments(parentPostId, limit = 100) {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `https://oauth.reddit.com/comments/${parentPostId}?limit=${limit}&sort=top`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'SentimentAnalysisApp/1.0 by /u/cuongiu2009'
        },
      }
    );
    const commentsData = response.data[1] ? response.data[1].data.children : [];
    return commentsData.map(child => ({
      parent_post_id: parentPostId,
      text: child.data.body,
      author: child.data.author,
      published_at: new Date(child.data.created_utc * 1000),
    }));
  },
};

module.exports = reddit;
