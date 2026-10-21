import type { MealApiRecord, MealSearchResponse, Recipe } from '../types/types'

const API_BASE = 'https://www.themealdb.com/api/json/v1/1'

function toRecipe(meal: MealApiRecord): Recipe {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`]?.trim()
    const measure = meal[`strMeasure${index + 1}`]?.trim()
    return ingredient ? [measure, ingredient].filter(Boolean).join(' ') : ''
  }).filter(Boolean)

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    imageUrl: meal.strMealThumb,
    category: meal.strCategory ?? 'Recipe',
    cuisine: meal.strArea ?? 'Kitchen classic',
    instructions: meal.strInstructions ?? '',
    ingredients,
    sourceUrl: meal.strSource || null,
    videoUrl: meal.strYoutube || null,
  }
}

export async function searchRecipes(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`, { signal })
  if (!response.ok) throw new Error(`Recipe service returned ${response.status}.`)

  const result = await response.json() as MealSearchResponse
  return Array.isArray(result.meals) ? result.meals.map(toRecipe) : []
}