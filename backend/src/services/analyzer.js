const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';
const MAX_TEXT_LENGTH = 500; // Set a safe max length for the model

const analyzer = {
  async analyzeSentiment(comments) {
    // Filter out comments with empty or undefined text
    const validComments = comments.filter(c => c.text && c.text.trim() !== '');

    if (validComments.length === 0) {
      return []; // Return empty if no valid comments to analyze
    }

    // Truncate long comments
    const truncatedInputs = validComments.map(c => c.text.substring(0, MAX_TEXT_LENGTH));

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: truncatedInputs }, // Use truncated inputs
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
      }
    );

    const results = response.data;
    // Map results back to the original comments, handling potential mismatches
    return comments.map(comment => {
      const validIndex = validComments.findIndex(vc => vc === comment);
      if (validIndex !== -1 && results[validIndex]) {
        const sentimentResult = results[validIndex][0]; // Get the top sentiment result
        return {
          ...comment,
          sentiment: sentimentResult.label.toLowerCase(),
        };
      } else {
        // If the comment was invalid or had no result, return it with a default sentiment
        return {
          ...comment,
          sentiment: 'neutral',
        };
      }
    });
  },
};

module.exports = analyzer;