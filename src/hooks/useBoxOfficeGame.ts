import { useCallback, useEffect, useRef, useState } from 'react'
import { CATEGORIES, getCategory, type CategoryId } from '../data/categories'
import { FALLBACK_MOVIES } from '../data/fallbackMovies'
import { drawPair, filterMoviesByCategory } from '../lib/movies'
import {
  fetchDiscoverPage,
  fetchMovieDetails,
  MAX_PAGES,
  PAGE_DELAY_MS,
  POOL_CAP,
  toInternalMovie,
} from '../services/tmdb'
import type { GamePhase, Movie, PickSide } from '../types/movie'

type GameScreen = 'category-select' | 'loading' | 'playing'

const BEST_SCORE_KEY = 'box-office-duel-best-score'
const REVEAL_DELAY_MS = 900
const ROUND_DURATION_SECONDS = 60
const INITIAL_TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim() ?? ''

export function useBoxOfficeGame() {
  const [champion, setChampion] = useState<Movie | null>(null)
  const [challenger, setChallenger] = useState<Movie | null>(null)
  const [phase, setPhase] = useState<GamePhase>('guessing')
  const [pickSide, setPickSide] = useState<PickSide | null>(null)
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS)
  const [isGameOver, setIsGameOver] = useState(false)
  const [screen, setScreen] = useState<GameScreen>('category-select')
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('random')
  const [tmdbKey] = useState(INITIAL_TMDB_KEY)
  const [pool, setPool] = useState<Movie[]>([])
  const [isBuildingPool, setIsBuildingPool] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const isGameOverRef = useRef(false)
  const lastPairRef = useRef<string[]>([])

  function setNextPair(source: Movie[]) {
    const [first, second] = drawPair(source, lastPairRef.current)
    setChampion(first)
    setChallenger(second)
    lastPairRef.current = [first.id, second.id]
  }

  function getFallbackSource(categoryId = selectedCategoryId) {
    return filterMoviesByCategory(FALLBACK_MOVIES, getCategory(categoryId))
  }

  function resetRunState() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setChampion(null)
    setChallenger(null)
    setPhase('guessing')
    setPickSide(null)
    setWasCorrect(null)
    setScore(0)
    setTimeLeft(ROUND_DURATION_SECONDS)
    setIsGameOver(false)
    setPool([])
    lastPairRef.current = []
  }

  useEffect(() => {
    const savedBestScore = Number(localStorage.getItem(BEST_SCORE_KEY))
    if (Number.isFinite(savedBestScore)) {
      setBestScore(savedBestScore)
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    isGameOverRef.current = isGameOver
  }, [isGameOver])

  useEffect(() => {
    if (screen !== 'playing' || !champion || !challenger || isGameOver) return

    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 1) {
          setIsGameOver(true)

          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          return 0
        }

        return currentTimeLeft - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [champion, challenger, isGameOver, screen])

  useEffect(() => {
    if (screen === 'loading' && !champion && !challenger && pool.length >= 2) {
      setNextPair(pool)
      setScreen('playing')
    }
  }, [champion, challenger, pool, screen])

  useEffect(() => {
    if (!tmdbKey || screen !== 'loading') return

    let cancelled = false
    let currentSize = 0
    setPool([])
    setIsBuildingPool(true)

    async function buildPool() {
      const category = getCategory(selectedCategoryId)
      const seenIds = new Set<number>()
      let page = 1

      while (!cancelled && page <= MAX_PAGES && currentSize < POOL_CAP) {
        let discoverData

        try {
          discoverData = await fetchDiscoverPage(tmdbKey, page, category.tmdbGenreId)
        } catch {
          break
        }

        if (cancelled) return

        const candidates = (discoverData.results ?? []).filter((movie) => !seenIds.has(movie.id))
        candidates.forEach((movie) => seenIds.add(movie.id))

        const details = await Promise.all(
          candidates.map((movie) => fetchMovieDetails(tmdbKey, movie.id)),
        )

        if (cancelled) return

        const mapped = details
          .filter((details): details is NonNullable<typeof details> => {
            return Boolean(details?.budget && details.revenue && details.poster_path)
          })
          .map(toInternalMovie)

        if (mapped.length) {
          setPool((previousPool) => {
            const existingIds = new Set(previousPool.map((movie) => movie.id))
            const freshMovies = mapped.filter((movie) => !existingIds.has(movie.id))
            const nextPool = [...previousPool, ...freshMovies].slice(0, POOL_CAP)
            currentSize = nextPool.length

            if (!cancelled && !champion && !challenger && nextPool.length >= 2) {
              window.setTimeout(() => {
                if (!cancelled) {
                  setNextPair(nextPool)
                  setScreen('playing')
                }
              }, 0)
            }

            return nextPool
          })
        }

        page += 1
        if (!discoverData.total_pages || page > discoverData.total_pages) break

        await new Promise((resolve) => {
          window.setTimeout(resolve, PAGE_DELAY_MS)
        })
      }

      if (!cancelled) {
        if (currentSize < 2) {
          setNextPair(getFallbackSource(selectedCategoryId))
          setScreen('playing')
        }

        setIsBuildingPool(false)
      }
    }

    void buildPool()

    return () => {
      // Changer de catégorie remonte ici via les dépendances de l'effet.
      // Le flag empêche les réponses réseau arrivées en retard d'ajouter des films
      // ou de remplacer la paire affichée pour la nouvelle catégorie.
      cancelled = true
      setIsBuildingPool(false)
    }
  }, [champion, challenger, screen, selectedCategoryId, tmdbKey])

  const persistBestScore = useCallback((value: number) => {
    localStorage.setItem(BEST_SCORE_KEY, String(value))
  }, [])

  const startCategory = useCallback(
    (categoryId: CategoryId) => {
      resetRunState()
      setSelectedCategoryId(categoryId)

      if (!tmdbKey) {
        setNextPair(getFallbackSource(categoryId))
        setScreen('playing')
        return
      }

      setScreen('loading')
    },
    [tmdbKey],
  )

  const showCategorySelect = useCallback(() => {
    resetRunState()
    setScreen('category-select')
  }, [])

  const restartGame = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const source = pool.length >= 2 ? pool : getFallbackSource()
    setScore(0)
    setTimeLeft(ROUND_DURATION_SECONDS)
    setIsGameOver(false)
    setPhase('guessing')
    setPickSide(null)
    setWasCorrect(null)
    setNextPair(source)
  }, [pool])

  const handlePick = useCallback(
    (side: PickSide) => {
      if (phase !== 'guessing' || isGameOver || !champion || !challenger) return

      const correct =
        side === 'champion'
          ? champion.revenue >= challenger.revenue
          : challenger.revenue >= champion.revenue

      setPickSide(side)
      setWasCorrect(correct)
      setPhase('revealed')

      if (correct) {
        setScore((currentScore) => {
          const nextScore = currentScore + 1
          setBestScore((currentBestScore) => {
            if (nextScore <= currentBestScore) return currentBestScore

            persistBestScore(nextScore)
            return nextScore
          })

          return nextScore
        })
      }

      timeoutRef.current = window.setTimeout(() => {
        if (isGameOverRef.current) return

        const source = pool.length >= 2 ? pool : getFallbackSource()
        setNextPair(source)
        setPhase('guessing')
        setPickSide(null)
        setWasCorrect(null)
      }, REVEAL_DELAY_MS)
    },
    [champion, challenger, isGameOver, persistBestScore, phase, pool],
  )

  return {
    bestScore,
    categories: CATEGORIES,
    champion,
    challenger,
    handlePick,
    isGameOver,
    isBuildingPool,
    phase,
    pickSide,
    pool,
    restartGame,
    score,
    screen,
    selectedCategory: getCategory(selectedCategoryId),
    showCategorySelect,
    startCategory,
    timeLeft,
    tmdbKey,
    wasCorrect,
  }
}
