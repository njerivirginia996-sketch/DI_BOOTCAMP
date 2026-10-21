# Sunday Table

A React + TypeScript recipe search app using a generic data-fetching component and Redux Toolkit request state.

```powershell
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build. Run `npm run lint` for Oxlint.

## Data source

Recipes load from the public TheMealDB search API, so no RapidAPI key is needed. Search terms are debounced; active requests are cancelled when a new search starts, and request IDs prevent stale responses from replacing newer results.

## Source structure

- `src/api/api.ts`: fetch and normalize meal records.
- `src/types/types.ts`: API, recipe, and request-state types.
- `src/features/dataSlice.ts`: Redux loading, success, failure, and clear actions.
- `src/app`: Redux store and typed hooks.
- `src/components/DataFetcher.tsx`: generic, reusable request component.
- `src/App.tsx`: recipe search UI and typed recipe cards.