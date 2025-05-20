import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

let cachedReviews = [];
let lastFetched = 0;

app.get('/reviews', async (req, res) => {
  const now = Date.now();
  const shouldRefresh = now - lastFetched > 1000 * 60 * 60 * 6; // refresh every 6 hours

  if (!shouldRefresh && cachedReviews.length > 0) {
    return res.json(cachedReviews);
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${process.env.PLACE_ID}&api_key=${process.env.SERPAPI_KEY}&hl=en`
    );
    const data = await response.json();

    const reviews = data.reviews || [];

    cachedReviews = reviews;
    lastFetched = now;

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews from SerpAPI:', error);
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
