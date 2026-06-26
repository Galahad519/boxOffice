import type { Movie } from '../types/movie'

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342'

function positiveEnvInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export const POOL_CAP = positiveEnvInt(import.meta.env.VITE_TMDB_POOL_CAP, 1000)
export const MAX_PAGES = positiveEnvInt(import.meta.env.VITE_TMDB_MAX_PAGES, 100)
export const PAGE_DELAY_MS = 350

type TmdbGenre = {
  id: number
  name: string
}

type TmdbDiscoverMovie = {
  id: number
}

type TmdbDiscoverResponse = {
  results?: TmdbDiscoverMovie[]
  total_pages?: number
}

export type TmdbMovieDetails = {
  id: number
  title?: string
  original_title?: string
  release_date?: string
  genres?: TmdbGenre[]
  budget: number
  revenue: number
  poster_path?: string | null
}

function gradientFromId(id: number) {
  const hue = (id * 47) % 360
  const hue2 = (hue + 35) % 360
  return { from: `hsl(${hue}, 42%, 24%)`, to: `hsl(${hue2}, 55%, 8%)` }
}

export function toInternalMovie(details: TmdbMovieDetails): Movie {
  const year = details.release_date ? Number(details.release_date.slice(0, 4)) : '—'
  const tag = (details.genres ?? []).map((genre) => genre.name).slice(0, 2).join(' / ')
  const { from, to } = gradientFromId(details.id)

  return {
    id: `tmdb-${details.id}`,
    title: details.title || details.original_title || 'Sans titre',
    year,
    budget: details.budget,
    revenue: details.revenue,
    tag: tag || 'Film',
    from,
    to,
    posterUrl: details.poster_path ? `${POSTER_BASE_URL}${details.poster_path}` : null,
  }
}

export async function fetchDiscoverPage(
  key: string,
  page: number,
  genreId: number | null,
  sortBy: string,
) {
  const params = new URLSearchParams({
    api_key: key,
    language: 'fr-FR',
    sort_by: sortBy,
    include_adult: 'false',
    'vote_count.gte': '300',
    page: String(page),
  })

  if (genreId) {
    params.set('with_genres', String(genreId))
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('Impossible de charger la page TMDB')
  }

  return response.json() as Promise<TmdbDiscoverResponse>
}

export async function fetchMovieDetails(key: string, id: number) {
  try {
    const params = new URLSearchParams({ api_key: key, language: 'fr-FR' })
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?${params.toString()}`,
    )

    if (!response.ok) {
      return null
    }

    return (await response.json()) as TmdbMovieDetails
  } catch {
    return null
  }
}
