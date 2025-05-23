const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const PLACE_ID = process.env.PLACE_ID;

if (!SERPAPI_KEY || !PLACE_ID) {
  console.error('Missing SERPAPI_KEY or PLACE_ID env vars');
  process.exit(1);
}

async function fetchReviews() {
  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${PLACE_ID}&api_key=${SERPAPI_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.reviews || data.reviews.length === 0) {
      throw new Error('No reviews found');
    }

    // Normalize or just save directly:
    return data.reviews;
  } catch (e) {
    console.error('Error fetching reviews:', e);
    process.exit(1);
  }
}

(async () => {
  const reviews = await fetchReviews();

  // Save with a timestamp to help your backend if needed
  const content = {
    lastFetched: new Date().toISOString(),
    reviews,
  };

  await fs.writeFile('reviews.json', JSON.stringify(content, null, 2), 'utf-8');
  console.log('reviews.json updated successfully');
})();
