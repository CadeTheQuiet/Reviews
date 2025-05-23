const fs = require('fs');
const path = require('path');

const SERPAPI_KEY = process.env.SERPAPI_KEY; // Make sure this env var is set

async function updateReviews() {
  try {
    const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=ChIJuyDfaumFf4gRpdTNhZ9Z0_Q&api_key=${SERPAPI_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.reviews || data.reviews.length === 0) {
      throw new Error('No reviews found in SerpAPI response');
    }

    // Save reviews.json locally
    const filePath = path.resolve(__dirname, 'reviews.json');
    fs.writeFileSync(filePath, JSON.stringify(data.reviews, null, 2));

    console.log(`Successfully updated ${data.reviews.length} reviews.`);
  } catch (error) {
    console.error('Failed to update reviews:', error.message);
  }
}

updateReviews();
