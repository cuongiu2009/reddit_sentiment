const redditCrawler = require('./crawlers/reddit');

const crawler = {
  async crawlComments(topic, sources, timeRange, sort, postLimit = 2, commentLimitPerPost = 100) { // Add sort
    let structuredResults = [];

    for (const source of sources) {
      if (source === 'reddit') {
        const subreddits = await redditCrawler.searchSubreddits(topic);
        console.log(`[Reddit Crawler] Found relevant subreddits: ${subreddits.join(', ')}`);

        for (const subreddit of subreddits) {
          try {
            const parentPosts = await redditCrawler.findTopPostsInSubreddit(subreddit, topic, timeRange, sort); // Pass sort
            const postsToCrawl = parentPosts.slice(0, postLimit);

            for (const post of postsToCrawl) {
              const allCommentsForPost = await redditCrawler.getComments(post.id, commentLimitPerPost);
              
              // No date filtering for now, as per user request
              const filteredComments = allCommentsForPost;

              console.log(`[Reddit Crawler] Found ${allCommentsForPost.length} comments for post ${post.id} in r/${subreddit}.`);

              if (filteredComments.length > 0) {
                structuredResults.push({
                  parentPost: post,
                  comments: filteredComments,
                });
              }
            }
          } catch (error) {
            if (error.response && error.response.status === 403) {
              console.warn(`[Reddit Crawler] Could not access subreddit r/${subreddit} (403 Forbidden). Skipping.`);
            } else {
              console.error(`[Reddit Crawler] Error processing subreddit r/${subreddit}:`, error.message);
            }
          }
        }
      } else {
        console.warn(`Crawler for source '${source}' not implemented yet.`);
      }
    }
    return structuredResults;
  },
};

module.exports = crawler;