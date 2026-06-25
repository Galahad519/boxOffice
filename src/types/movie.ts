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
