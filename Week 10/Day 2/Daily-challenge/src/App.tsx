import { useState, type CSSProperties, type FormEvent } from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { useAppSelector } from './app/hooks'
import { searchRecipes } from './api/api'
import { DataFetcher } from './components/DataFetcher'
import type { Recipe } from './types/types'
import './daily.css'

const quickSearches = ['Chicken', 'Pasta', 'Seafood', 'Vegetarian', 'Dessert']

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const excerpt = recipe.instructions.replace(/\s+/g, ' ').trim()
  const shortExcerpt = excerpt.length > 128 ? `${excerpt.slice(0, 128).trimEnd()}…` : excerpt

  return (
    <article className="recipe-card" style={{ '--card-order': index } as CSSProperties}>
      <div className="recipe-image-wrap">
        <img alt={recipe.title} className="recipe-image" loading="lazy" src={recipe.imageUrl} />
        <span className="recipe-category">{recipe.category}</span>
        <span className="recipe-number">RECIPE <i>{String(index + 1).padStart(2, '0')}</i></span>
      </div>
      <div className="recipe-copy">
        <div className="recipe-meta"><span>{recipe.cuisine}</span><span className="meta-dot" /> <span>{recipe.ingredients.length} ingredients</span></div>
        <h2>{recipe.title}</h2>
        <p className="recipe-excerpt">{shortExcerpt || 'A recipe worth keeping in your weekly rotation.'}</p>
        <details className="recipe-details">
          <summary>Ingredients and method <span aria-hidden="true">+</span></summary>
          <div className="recipe-detail-content">
            <div><h3>Ingredients</h3><ul>{recipe.ingredients.map((ingredient, ingredientIndex) => <li key={`${ingredientIndex}-${ingredient}`}>{ingredient}</li>)}</ul></div>
            <div><h3>Method</h3><p>{recipe.instructions || 'See the recipe source for preparation details.'}</p></div>
          </div>
        </details>
        <div className="recipe-links">
          {recipe.sourceUrl ? <a href={recipe.sourceUrl} rel="noreferrer" target="_blank">Recipe details <span aria-hidden="true">↗</span></a> : <span className="no-source">Recipe details unavailable</span>}
          {recipe.videoUrl && <a aria-label={`Watch ${recipe.title} video`} className="video-link" href={recipe.videoUrl} rel="noreferrer" target="_blank">Watch <span aria-hidden="true">▶</span></a>}
        </div>
      </div>
    </article>
  )
}

function RecipeBrowser() {
  const [query, setQuery] = useState('chicken')
  const [draft, setDraft] = useState('chicken')
  const { data, status } = useAppSelector((state) => state.data)
  const recipeCount = Array.isArray(data) ? data.length : 0

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuery(draft.trim())
  }

  function chooseSearch(term: string) {
    setDraft(term.toLocaleLowerCase())
    setQuery(term)
  }

  return (
    <div className="daily-app">
      <header className="topbar">
        <a aria-label="Sunday Table home" className="brand" href="#top"><span className="brand-icon">ST<span>.</span></span><span>SUNDAY TABLE<small>THE RECIPE INDEX</small></span></a>
        <span className="api-status"><i className={status === 'failed' ? 'offline' : ''} /> {status === 'failed' ? 'SERVICE PAUSED' : 'RECIPE INDEX / LIVE'}</span>
      </header>

      <main id="top">
        <section className="search-hero">
          <div className="hero-copy">
            <p className="eyebrow">A BETTER ANSWER TO “WHAT’S FOR DINNER?”</p>
            <h1>Find your next<br /><em>favorite.</em></h1>
            <p className="hero-description">A little inspiration for whatever is in your fridge, pantry, or plans.</p>
            <form className="search-form" onSubmit={submitSearch}>
              <span aria-hidden="true" className="search-mark">⌕</span>
              <label className="sr-only" htmlFor="recipe-search">Search dishes, ingredients, or cuisine</label>
              <input autoComplete="off" id="recipe-search" onChange={(event) => setDraft(event.target.value)} placeholder="Try “lemon pasta” or “chickpeas”…" value={draft} />
              <button aria-label="Search recipes" type="submit"><span>Find recipes</span><span aria-hidden="true">→</span></button>
            </form>
            <div className="quick-search"><span>IN THE MOOD FOR</span>{quickSearches.map((term) => <button className={query.toLocaleLowerCase() === term.toLocaleLowerCase() ? 'selected' : ''} key={term} onClick={() => chooseSearch(term)} type="button">{term}</button>)}</div>
          </div>
          <figure className="hero-image">
            <img alt="Fresh vegetables and herbs ready for cooking" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1100&q=85" />
            <figcaption><span>GOOD FOOD, NO FUSS</span><span>ISSUE 01 <i>/</i> EVERYDAY COOKING</span></figcaption>
          </figure>
          <span aria-hidden="true" className="hero-index">01 <i>/</i> 05</span>
        </section>

        <section className="results-heading">
          <div><p className="eyebrow">THE DAILY FIND</p><h2>{query ? `Recipes for ${query}` : 'Explore recipes'}</h2></div>
          <div className="results-count"><strong>{String(recipeCount).padStart(2, '0')}</strong><span>{status === 'loading' ? 'SEARCHING' : 'RECIPES FOUND'}</span></div>
        </section>

        <DataFetcher<Recipe>
          emptyMessage="Try a broader ingredient or a different dish name."
          fetchData={searchRecipes}
          getKey={(recipe) => recipe.id}
          query={query}
          renderItem={(recipe, index) => <RecipeCard index={index} recipe={recipe} />}
        />
      </main>

      <footer className="site-footer"><span>SUNDAY TABLE <i>·</i> RECIPE INDEX</span><span>MADE FOR THE EVERYDAY COOK</span></footer>
    </div>
  )
}

export default function App() {
  return <Provider store={store}><RecipeBrowser /></Provider>
}