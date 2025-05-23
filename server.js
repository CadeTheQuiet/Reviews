const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Serve the reviews JSON file
app.get('/reviews', (req, res) => {
  const data = fs.readFileSync('reviews.json', 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Endpoint to trigger reviews update
app.get('/update-reviews', async (req, res) => {
  try {
    const SERP_API_KEY = process.env.SERP_API_KEY;
    const PLACE_ID = 'ChIJuyDfaumFf4gRpdTNhZ9Z0_Q';

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${PLACE_ID}&api_key=${SERP_API_KEY}`
    );
    const data = await response.json();

    if (data && data.reviews) {
      fs.writeFileSync('reviews.json', JSON.stringify(data.reviews, null, 2));
      res.send('✅ Reviews updated.');
    } else {
      res.status(500).send('❌ No reviews found.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error updating reviews.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});