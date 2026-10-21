import { v4 as uuidv4 } from 'uuid'

export type RecipeData = {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  isFavorite: boolean
}

export class RecipeItem implements RecipeData {
  readonly id: string
  title: string
  ingredients: string[]
  instructions: string
  isFavorite: boolean

  constructor(
    title: string,
    ingredients: string[],
    instructions: string,
    id = uuidv4(),
    isFavorite = false,
  ) {
    this.id = id
    this.title = title
    this.ingredients = [...ingredients]
    this.instructions = instructions
    this.isFavorite = isFavorite
  }
}