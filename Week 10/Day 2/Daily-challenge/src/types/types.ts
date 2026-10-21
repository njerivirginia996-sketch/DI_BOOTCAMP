export interface Recipe {
  id: string
  title: string
  imageUrl: string
  category: string
  cuisine: string
  instructions: string
  ingredients: string[]
  sourceUrl: string | null
  videoUrl: string | null
}

export interface MealApiRecord {
  [field: string]: string | null | undefined
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
  strSource: string | null
  strYoutube: string | null
}

export interface MealSearchResponse {
  meals: MealApiRecord[] | null
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface DataState {
  data: unknown
  status: RequestStatus
  error: string | null
  activeRequestId: string | null
}