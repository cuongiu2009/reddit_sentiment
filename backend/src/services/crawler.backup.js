const redditCrawler = require('./crawlers/reddit');

const crawler = {
  async crawlComments(topic, sources, timeRange, postLimit = 10, commentLimitPerPost = 100) {
    let structuredResults = [];

    for (const source of sources) {
      if (source === 'reddit') {
        const parentPosts = await redditCrawler.findParentPosts(topic, timeRange);
        const postsToCrawl = parentPosts.slice(0, postLimit);

        for (const post of postsToCrawl) {
          const comments = await redditCrawler.getComments(post.id, commentLimitPerPost);
          structuredResults.push({
            parentPost: post,
            comments: comments,
          });
        }
      } else {
        console.warn(`Crawler for source '${source}' not implemented yet.`);
      }
    }
    return structuredResults;
  },
};

module.exports = crawler;
