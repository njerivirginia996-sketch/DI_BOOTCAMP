# Snapshot

A responsive photo gallery built with React, React Router, and the Pexels API.

## Run locally

1. Install dependencies with `npm install`.
2. Add a Pexels API key to a `.env.local` file in the project root:

	```env
	VITE_PEXELS_API_KEY=your_pexels_api_key
	```

3. Start the development server with `npm run dev`.

Without an API key, the gallery displays a small curated preview collection. With a key, category and search pages load 30 Pexels photos at a time, and the Load more button fetches the next page.
