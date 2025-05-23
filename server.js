require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const CACHE_FILE = path.join(__dirname, 'reviews.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper: fetch reviews from SerpAPI
async function fetchReviewsFromSerpAPI() {
  const serpApiKey = process.env.SERPAPI_KEY;
  const placeId = process.env.PLACE_ID;

  if (!serpApiKey || !placeId) {
    throw new Error('SERPAPI_KEY and PLACE_ID must be set in environment variables');
  }

  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${serpApiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data['reviews']) {
    throw new Error('No reviews found in SerpAPI response');
  }

  // Return just the reviews array
  return data['reviews'];
}

// Helper: read cache
async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Helper: write cache
async function writeCache(data) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Check if cache is fresh
function isCacheFresh(cachedData) {
  if (!cachedData || !cachedData.timestamp || !cachedData.reviews) return false;
  const age = Date.now() - cachedData.timestamp;
  return age < CACHE_DURATION_MS;
}

app.get('/reviews', async (req, res) => {
  try {
    // Try to load cache
    let cachedData = await readCache();

    if (isCacheFresh(cachedData)) {
      // Serve cached reviews
      return res.json(cachedData.reviews);
    }

    // Cache expired or missing - fetch new data
    const reviews = await fetchReviewsFromSerpAPI();

    // Save to cache with timestamp
    cachedData = {
      timestamp: Date.now(),
      reviews,
    };
    await writeCache(cachedData);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);

    // On error, fallback to cache if possible
    const cachedData = await readCache();
    if (cachedData && cachedData.reviews) {
      return res.json(cachedData.reviews);
    }

    // No cache available
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
