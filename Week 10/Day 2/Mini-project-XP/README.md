# The Good Table

A vanilla TypeScript recipe book built with Vite. Recipes are stored in browser `localStorage`.

```powershell
npm install
npm run dev
```

Run `npm run build` to type-check the project and create a production bundle.

## Source structure

- `src/model/RecipeItem.ts`: typed recipe entity with UUID generation.
- `src/model/RecipeCollection.ts`: recipe operations and localStorage persistence.
- `src/templates/RecipeTemplate.ts`: safe DOM rendering for recipe cards.
- `src/main.ts`: form, filters, search, and event handling.