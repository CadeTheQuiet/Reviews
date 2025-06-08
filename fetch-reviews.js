const fs = require('fs');
const https = require('https');

const apiKey = process.env.SERPAPI_KEY;
const placeId = process.env.PLACE_ID;
let allReviews = [];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';

      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function fetchAllReviews() {
  let url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${apiKey}`;
  let page = 1;

  while (url && page <= 5) { // safety limit to 5 pages
    const response = await fetchPage(url);

    if (response.reviews) {
      allReviews.push(...response.reviews);
    }

    if (response.serpapi_pagination && response.serpapi_pagination.next) {
      url = response.serpapi_pagination.next;
      page++;
    } else {
      url = null;
    }
  }

  fs.writeFileSync('reviews.json', JSON.stringify(allReviews, null, 2));
}

fetchAllReviews();
