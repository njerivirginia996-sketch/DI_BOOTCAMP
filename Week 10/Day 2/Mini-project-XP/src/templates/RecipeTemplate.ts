import type { RecipeItem } from '../model/RecipeItem'

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => entities[character])
}

export class RecipeTemplate {
  private readonly container: HTMLDivElement
  private readonly visibleCount: HTMLElement

  constructor(
    container: HTMLDivElement,
    visibleCount: HTMLElement,
  ) {
    this.container = container
    this.visibleCount = visibleCount
  }

  render(recipes: RecipeItem[]): void {
    this.visibleCount.textContent = `${String(recipes.length).padStart(2, '0')} SHOWN`

    if (recipes.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <span class="empty-stamp" aria-hidden="true">✳</span>
          <h3>Your shelf is waiting.</h3>
          <p>Add a recipe or try another filter to find something delicious.</p>
        </div>
      `
      return
    }

    this.container.innerHTML = recipes.map((recipe, index) => `
      <article class="recipe-card" style="--card-order:${index}" aria-labelledby="recipe-${escapeHtml(recipe.id)}">
        <div class="recipe-card-top">
          <span class="recipe-number">${String(index + 1).padStart(2, '0')} <i>/</i> RECIPE</span>
          <button class="favorite-button${recipe.isFavorite ? ' is-favorite' : ''}" type="button" data-action="favorite" data-id="${escapeHtml(recipe.id)}" aria-pressed="${recipe.isFavorite}" aria-label="${recipe.isFavorite ? 'Remove from' : 'Add to'} favorites">
            <span aria-hidden="true">${recipe.isFavorite ? '♥' : '♡'}</span><span>${recipe.isFavorite ? 'SAVED' : 'SAVE'}</span>
          </button>
        </div>
        <h3 id="recipe-${escapeHtml(recipe.id)}">${escapeHtml(recipe.title)}</h3>
        <p class="recipe-summary">${recipe.ingredients.length} ingredients <i>·</i> ${escapeHtml(recipe.instructions.split(/[.!?\n]/)[0] || 'A recipe to keep close.')}</p>
        <details class="recipe-details">
          <summary><span>Open recipe</span><span class="details-mark" aria-hidden="true">+</span></summary>
          <div class="recipe-detail-content">
            <div><h4>Ingredients</h4><ul>${recipe.ingredients.map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join('')}</ul></div>
            <div><h4>Method</h4><p>${escapeHtml(recipe.instructions)}</p></div>
          </div>
        </details>
        <div class="recipe-card-footer"><span>${recipe.isFavorite ? 'A HOUSE FAVORITE' : 'FROM YOUR KITCHEN'}</span><button class="delete-button" type="button" data-action="delete" data-id="${escapeHtml(recipe.id)}" aria-label="Delete ${escapeHtml(recipe.title)}">Remove <span aria-hidden="true">×</span></button></div>
      </article>
    `).join('')
  }
}