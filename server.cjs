const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/reviews', async (req, res) => {
  const apiKey = process.env.SERPAPI_KEY;
  const placeId = process.env.PLACE_ID;

  try {
    const response = await fetch(`https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${apiKey}&hl=en`);
    const data = await response.json();

    console.log('Fetched reviews from SerpAPI:', data.reviews?.length); // For debugging

    if (data.reviews) {
      res.json(data.reviews);
    } else {
      res.status(500).json({ error: 'No reviews found in response', raw: data });
    }
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
