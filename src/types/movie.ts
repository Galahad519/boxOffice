export type Movie = {
  id: string
  title: string
  year: number | string
  budget: number
  revenue: number
  tag: string
  from: string
  to: string
  posterUrl: string | null
}

export type PickSide = 'champion' | 'challenger'

export type GamePhase = 'guessing' | 'revealed'

export type GameScreen = 'category-select' | 'loading' | 'playing'

export type LeaderboardEntry = {
  pseudo: string
  score: number
  categoryLabel: string
  createdAt: string
}

export type SubmittedScore = LeaderboardEntry & {
  categoryId: string
}
