import './recipe-book.css'
import { RecipeCollection, type NewRecipe } from './model/RecipeCollection'
import { RecipeTemplate } from './templates/RecipeTemplate'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Could not find the application root.')
}

root.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#top" aria-label="The Good Table home"><span class="brand-mark">gt<span>.</span></span><span>THE GOOD TABLE<small>YOUR RECIPE BOOK</small></span></a>
    <div class="topbar-note"><span class="storage-indicator"></span> STORED ON THIS DEVICE</div>
  </header>
  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">A COLLECTION FOR THE KITCHEN</p>
        <h1 id="hero-title">Good food<br />lives <em>here.</em></h1>
        <p class="hero-description">A well-loved place for the recipes you make, keep, and come back to.</p>
        <div class="hero-byline"><span class="byline-rule"></span><span>GATHERED AT HOME</span><span class="byline-year">NO. 01</span></div>
      </div>
      <figure class="hero-photo">
        <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85" alt="A fresh bowl of greens, herbs, and colorful vegetables" />
        <figcaption><span>THE EVERYDAY TABLE</span><span>FRESH, SIMPLE, GOOD</span></figcaption>
      </figure>
      <span class="hero-index" aria-hidden="true">01 <i>/</i> 05</span>
    </section>

    <section class="collection-bar" aria-label="Recipe collection summary">
      <div><span class="section-kicker">THE COLLECTION</span><h2>Recipes to return to</h2></div>
      <div class="collection-stats"><span id="recipeCount">00 <small>RECIPES</small></span><span class="stat-divider"></span><span id="favoriteCount">00 <small>FAVORITES</small></span></div>
    </section>

    <section class="workspace" aria-label="Recipe book">
      <aside class="editor-panel" aria-labelledby="formTitle">
        <div class="editor-heading"><span class="section-kicker">ADD TO YOUR BOOK</span><span class="editor-number">A / 01</span></div>
        <h2 id="formTitle">Save a recipe</h2>
        <form id="recipeEntryForm">
          <label for="recipeTitle">Recipe name</label>
          <input type="text" id="recipeTitle" name="title" placeholder="e.g. Sunday tomato pasta" maxlength="80" required />
          <label for="ingredients">Ingredients <span class="label-hint">ONE PER LINE</span></label>
          <textarea id="ingredients" name="ingredients" placeholder="Ripe tomatoes&#10;Olive oil&#10;A handful of basil" rows="5" required></textarea>
          <label for="instructions">Method <span class="label-hint">HOW IT COMES TOGETHER</span></label>
          <textarea id="instructions" name="instructions" placeholder="Add the steps, one at a time…" rows="5" required></textarea>
          <button class="add-button" type="submit"><span>Add recipe</span><span class="button-arrow" aria-hidden="true">↗</span></button>
          <p id="formMessage" class="form-message" aria-live="polite"></p>
        </form>
      </aside>

      <section class="collection-panel" aria-labelledby="collectionTitle">
        <div class="collection-tools">
          <div class="filter-tabs" role="group" aria-label="Filter recipes">
            <button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">All recipes</button>
            <button class="filter-button" type="button" data-filter="favorites" aria-pressed="false">Favorites <span aria-hidden="true">♡</span></button>
          </div>
          <label class="search-field"><span class="sr-only">Search recipes</span><span aria-hidden="true">⌕</span><input id="recipeSearch" type="search" placeholder="Find a recipe" autocomplete="off" /></label>
        </div>
        <div class="list-heading"><h2 id="collectionTitle">Your shelf</h2><span id="visibleCount" class="visible-count">0 SHOWN</span></div>
        <div id="recipeContainer" class="recipe-list" aria-live="polite"></div>
        <div class="collection-footer"><span>MADE TO BE MADE AGAIN</span><button id="clearRecipesButton" class="clear-button" type="button">Clear all recipes <span aria-hidden="true">×</span></button></div>
      </section>
    </section>
  </main>
  <footer class="site-footer"><span>THE GOOD TABLE <i>·</i> PERSONAL RECIPE BOOK</span><span>YOUR KITCHEN, YOUR COLLECTION</span></footer>
`

const recipes = new RecipeCollection()
const recipeTemplate = new RecipeTemplate(
  document.querySelector<HTMLDivElement>('#recipeContainer')!,
  document.querySelector<HTMLElement>('#visibleCount')!,
)
const form = document.querySelector<HTMLFormElement>('#recipeEntryForm')!
const searchInput = document.querySelector<HTMLInputElement>('#recipeSearch')!
const formMessage = document.querySelector<HTMLParagraphElement>('#formMessage')!
const filterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'))
let activeFilter: 'all' | 'favorites' = 'all'

function renderCollection(): void {
  const allRecipes = recipes.getAll()
  const query = searchInput.value.trim().toLocaleLowerCase()
  const visibleRecipes = allRecipes.filter((recipe) => {
    const matchesFavorite = activeFilter === 'all' || recipe.isFavorite
    const searchableText = [recipe.title, ...recipe.ingredients, recipe.instructions].join(' ').toLocaleLowerCase()
    return matchesFavorite && searchableText.includes(query)
  })

  recipeTemplate.render(visibleRecipes)
  document.querySelector<HTMLElement>('#recipeCount')!.innerHTML = `${String(allRecipes.length).padStart(2, '0')} <small>RECIPES</small>`
  document.querySelector<HTMLElement>('#favoriteCount')!.innerHTML = `${String(allRecipes.filter((recipe) => recipe.isFavorite).length).padStart(2, '0')} <small>FAVORITES</small>`
  document.querySelector<HTMLButtonElement>('#clearRecipesButton')!.disabled = allRecipes.length === 0
}

form.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()
  const formData = new FormData(form)
  const ingredients = String(formData.get('ingredients'))
    .split(/\r?\n/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
  const recipe: NewRecipe = {
    title: String(formData.get('title')).trim(),
    ingredients,
    instructions: String(formData.get('instructions')).trim(),
  }

  if (ingredients.length === 0) {
    formMessage.textContent = 'Add at least one ingredient to save this recipe.'
    return
  }

  recipes.addRecipe(recipe)
  form.reset()
  formMessage.textContent = 'Recipe added to your book.'
  activeFilter = 'all'
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter
    button.classList.toggle('is-active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  })
  searchInput.value = ''
  renderCollection()
})

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter === 'favorites' ? 'favorites' : 'all'
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button
      filterButton.classList.toggle('is-active', isActive)
      filterButton.setAttribute('aria-pressed', String(isActive))
    })
    renderCollection()
  })
})

searchInput.addEventListener('input', renderCollection)

document.querySelector<HTMLButtonElement>('#clearRecipesButton')!.addEventListener('click', () => {
  recipes.clear()
  formMessage.textContent = 'Your recipe book is clear.'
  renderCollection()
})

document.querySelector<HTMLDivElement>('#recipeContainer')!.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  const actionButton = target.closest<HTMLButtonElement>('[data-action]')
  if (!actionButton) return

  const recipeId = actionButton.dataset.id
  if (!recipeId) return

  if (actionButton.dataset.action === 'favorite') {
    recipes.toggleFavorite(recipeId)
  } else if (actionButton.dataset.action === 'delete') {
    recipes.removeRecipe(recipeId)
  }
  renderCollection()
})

renderCollection()
