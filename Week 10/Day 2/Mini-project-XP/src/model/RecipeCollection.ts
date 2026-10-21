import { RecipeItem, type RecipeData } from './RecipeItem'

export type NewRecipe = Pick<RecipeData, 'title' | 'ingredients' | 'instructions'>

const STORAGE_KEY = 'the-good-table-recipes'

function isRecipeData(value: unknown): value is RecipeData {
  if (typeof value !== 'object' || value === null) return false
  const recipe = value as Partial<RecipeData>
  return typeof recipe.id === 'string'
    && typeof recipe.title === 'string'
    && Array.isArray(recipe.ingredients)
    && recipe.ingredients.every((ingredient) => typeof ingredient === 'string')
    && typeof recipe.instructions === 'string'
    && typeof recipe.isFavorite === 'boolean'
}

export class RecipeCollection {
  private recipes: RecipeItem[]
  private readonly storageKey: string

  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey
    this.recipes = this.load()
  }

  getAll(): RecipeItem[] {
    return [...this.recipes]
  }

  addRecipe(recipe: NewRecipe): RecipeItem {
    const newRecipe = new RecipeItem(recipe.title, recipe.ingredients, recipe.instructions)
    this.recipes.unshift(newRecipe)
    this.save()
    return newRecipe
  }

  removeRecipe(id: string): void {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id)
    this.save()
  }

  toggleFavorite(id: string): void {
    const recipe = this.recipes.find((item) => item.id === id)
    if (!recipe) return
    recipe.isFavorite = !recipe.isFavorite
    this.save()
  }

  clear(): void {
    this.recipes = []
    this.save()
  }

  save(): boolean {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.recipes))
      return true
    } catch {
      return false
    }
  }

  private load(): RecipeItem[] {
    try {
      const storedRecipes: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]')
      if (!Array.isArray(storedRecipes)) return []
      return storedRecipes.filter(isRecipeData).map((recipe) => new RecipeItem(
        recipe.title,
        recipe.ingredients,
        recipe.instructions,
        recipe.id,
        recipe.isFavorite,
      ))
    } catch {
      return []
    }
  }
}