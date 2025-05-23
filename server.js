import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

app.get('/reviews', async (req, res) => {
  if (!SERPAPI_KEY) {
    return res.status(500).json({ status: 'error', message: 'Missing SERPAPI_KEY env variable' });
  }

  // Replace with your actual Place ID
  const placeId = 'ChIJuyDfaumFf4gRpdTNhZ9Z0_Q';

  const serpApiUrl = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${SERPAPI_KEY}`;

  try {
    const response = await fetch(serpApiUrl);
    const data = await response.json();

    if (!data || !data.reviews || data.reviews.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No reviews found in SerpAPI response' });
    }

    // Map the reviews into your expected format
    const reviews = data.reviews.map(r => ({
      review_id: r.review_id,
      rating: r.rating,
      date: r.relative_time_description || '',
      iso_date: r.date || '',
      author_name: r.user_name || '',
      author_url: r.user_url || '',
      profile_photo_url: r.profile_photo || '',
      text: r.snippet || r.text || '',
    }));

    res.json(reviews);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
