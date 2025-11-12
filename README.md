# NewsNow — Real-Time News Portal

**Course:** Web Technologies  
**Assignment:** NewsNow – Real-Time News Portal

## Overview
NewsNow fetches and displays live headlines using the NewsAPI. Users can filter by country and category, search keywords, and navigate pages. It supports auto-refresh for live updates.

## Features
- Top headlines & keyword search
- Country and category filters
- Auto-refresh every 60 seconds (toggleable)
- Pagination & page-size control
- API test utility
- Responsive UI (Tailwind CSS)

## Setup
1. Clone the repo and open `index.html`.
2. The API key is embedded in `script.js` as `NEWS_API_KEY`:
   ```js
   const NEWS_API_KEY = 'YOUR API KEY';
   ```
## Notes & Limitations

NewsAPI free tier has request limits; avoid frequent polling during grading.

everything endpoint may return more results but has stricter rate limits.

For production, keep API keys out of client-side code (use a server or serverless proxy).

## Deployment

Push to GitHub and enable GitHub Pages (Settings → Pages → Deploy from branch).

The site is static and can be hosted on GitHub Pages.

## How to use

Select country & category, or enter keywords.

Click Search or Load Top Headlines to fetch.

Use Next/Previous to paginate results.

Toggle Auto-refresh to enable live updates.

## License

For educational use.
