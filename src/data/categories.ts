export type CategoryId =
  | 'random'
  | 'thriller'
  | 'policier'
  | 'fantastique'
  | 'science-fiction'
  | 'horreur'
  | 'action'
  | 'comedie'
  | 'drame'
  | 'animation'
  | 'aventure'

export type Category = {
  id: CategoryId
  label: string
  tmdbGenreId: number | null
  fallbackKeywords: string[]
}

export const CATEGORIES: Category[] = [
  { id: 'random', label: 'Random', tmdbGenreId: null, fallbackKeywords: [] },
  { id: 'thriller', label: 'Thriller', tmdbGenreId: 53, fallbackKeywords: ['thriller'] },
  { id: 'policier', label: 'Policier', tmdbGenreId: 80, fallbackKeywords: ['policier', 'polar', 'crime'] },
  { id: 'fantastique', label: 'Fantastique', tmdbGenreId: 14, fallbackKeywords: ['fantastique'] },
  {
    id: 'science-fiction',
    label: 'Science-Fiction',
    tmdbGenreId: 878,
    fallbackKeywords: ['science-fiction', 'sci-fi', 'space opera', 'super-héros'],
  },
  { id: 'horreur', label: 'Horreur', tmdbGenreId: 27, fallbackKeywords: ['horreur'] },
  { id: 'action', label: 'Action', tmdbGenreId: 28, fallbackKeywords: ['action', 'super-héros'] },
  { id: 'comedie', label: 'Comédie', tmdbGenreId: 35, fallbackKeywords: ['comedie', 'comédie'] },
  { id: 'drame', label: 'Drame', tmdbGenreId: 18, fallbackKeywords: ['drame'] },
  { id: 'animation', label: 'Animation', tmdbGenreId: 16, fallbackKeywords: ['animation'] },
  { id: 'aventure', label: 'Aventure', tmdbGenreId: 12, fallbackKeywords: ['aventure', 'space opera'] },
]

export function getCategory(categoryId: CategoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? CATEGORIES[0]
}
