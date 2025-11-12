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
   const NEWS_API_KEY = 'c90234f0875a4e0698749ac6e593f78e';
