# Reviews Backend

## Setup

1. Clone or unzip this repo.
2. Run `npm install`.
3. Set environment variable `SERPAPI_KEY` with your SerpAPI key.
4. Replace `data_id` in `server.js` with your actual Google place `data_id` from SerpAPI.
5. Run the server with `npm start` or deploy to Render.

## Endpoints

- `GET /reviews` — returns cached reviews.
- `GET /reviews?update=true` — fetches fresh reviews from SerpAPI, updates cache, and returns reviews.

## Deployment notes

- Set `SERPAPI_KEY` environment variable on your Render service.
- Use a cron job on Render or an external service to hit `/reviews?update=true` once every 24 hours to refresh cache.
- Your frontend should fetch `/reviews` for cached, fast-loading reviews.
