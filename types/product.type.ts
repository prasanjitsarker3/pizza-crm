export type SpicyLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
export interface ICategory {
  id: string
  name: string
  slug: string
  description: string
  order: number
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IProduct {
  id: string
  name: string
  description: string
  price: number
  discount: number | null
  ingredients: string[]
  spicyLevel: SpicyLevel[]
  featured: boolean
  popular: boolean
  isActive: boolean
  isDeleted: boolean
  mainImages: string[]
  available: boolean
  slug: string
  categories: ICategory[]
  createdAt: string
  updatedAt: string
}
