const SERP_API_KEY = process.env.SERP_API_KEY;
const PLACE_ID = 'ChIJuyDfaumFf4gRpdTNhZ9Z0_Q'; // Your Google Place ID
const endpoint = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${PLACE_ID}&api_key=${SERP_API_KEY}`;

const response = await fetch(endpoint);
const data = await response.json();

// Optionally filter/transform `data.reviews` if needed
fs.writeFileSync('reviews.json', JSON.stringify(data.reviews, null, 2));
