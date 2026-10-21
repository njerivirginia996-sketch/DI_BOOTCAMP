# Open Shelf

A personal book library built with React, TypeScript, Redux Toolkit, and Vite.

```powershell
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build. Run `npm run lint` for Oxlint.

## Features

- Add and remove books, track pages read, and mark finished titles.
- Filter by reading status or category; create and remove categories.
- Debounced search with matching title and author highlights.
- Sort by title, author, or date added in either direction.
- Set a yearly reading goal and track finished books.
- Persist your library in localStorage; import and export JSON backups.

## Source structure

- `src/model/Book.ts`: Book interface, model class, and serialization.
- `src/app`: Redux store, slice, and typed hooks.
- `src/hooks/useBookLibrary.ts`: Typed book and filter operations.
- `src/components`: Book input, toolbar, list, cards, and category navigation.