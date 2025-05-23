const fs = require('fs');
const fetch = require('node-fetch');

async function fetchAndUpdate() {
  try {
    const response = await fetch('https://your-source.com/api'); // Replace with your real endpoint
    const data = await response.json();
    fs.writeFileSync('reviews.json', JSON.stringify(data, null, 2));
    console.log('Reviews updated.');
  } catch (err) {
    console.error('Failed to fetch or write reviews:', err);
  }
}

fetchAndUpdate();