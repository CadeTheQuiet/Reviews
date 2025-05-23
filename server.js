import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const REVIEWS_FILE = path.resolve('./reviews.json');

async function fetchReviewsFromSerpapi() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error('Missing SERPAPI_KEY env variable');

  // Replace data_id below with your actual data_id or place id from SerpAPI
  const params = new URLSearchParams({
    engine: 'google_maps_reviews',
    data_id: 'ChIJuyDfaumFf4gRpdTNhZ9Z0_Q',
    hl: 'en',
    api_key: apiKey,
  });

  const url = `https://serpapi.com/search?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`SerpAPI fetch failed: ${res.statusText}`);

  const data = await res.json();
  if (!data.reviews) throw new Error('No reviews found in SerpAPI response');

  await fs.writeFile(REVIEWS_FILE, JSON.stringify(data.reviews, null, 2));
  return data.reviews;
}

app.get('/reviews', async (req, res) => {
  try {
    const update = req.query.update === 'true';

    if (update) {
      const reviews = await fetchReviewsFromSerpapi();
      return res.json({ status: 'success', message: `Updated ${reviews.length} reviews`, reviews });
    }

    // Serve cached reviews
    const cached = await fs.readFile(REVIEWS_FILE, 'utf-8');
    const reviews = JSON.parse(cached);
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
