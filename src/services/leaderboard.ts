import type { CategoryId } from '../data/categories'
import type { LeaderboardEntry, SubmittedScore } from '../types/movie'
import { isSupabaseConfigured, supabase } from './supabase'

type SubmitScoreInput = {
  pseudo: string
  categoryId: CategoryId
  categoryLabel: string
  score: number
}

type ScoreRow = {
  pseudo: string
  category_id: string
  category_label: string
  score: number
  created_at: string
}

export async function submitScore({
  pseudo,
  categoryId,
  categoryLabel,
  score,
}: SubmitScoreInput): Promise<{ data: SubmittedScore | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: 'Classement en ligne non configuré.' }
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .insert({
        pseudo,
        category_id: categoryId,
        category_label: categoryLabel,
        score,
      })
      .select('pseudo, category_id, category_label, score, created_at')
      .single<ScoreRow>()

    if (error) {
      return { data: null, error: error.message }
    }

    return {
      data: {
        pseudo: data.pseudo,
        categoryId: data.category_id,
        categoryLabel: data.category_label,
        score: data.score,
        createdAt: data.created_at,
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Erreur réseau Supabase.',
    }
  }
}

export async function fetchTopScores(
  limit = 20,
): Promise<{ data: LeaderboardEntry[]; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: 'Classement en ligne non configuré.' }
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('pseudo, category_label, score, created_at')
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: [], error: error.message }
    }

    return {
      data: (data ?? []).map((row) => ({
        pseudo: row.pseudo,
        score: row.score,
        categoryLabel: row.category_label,
        createdAt: row.created_at,
      })),
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Erreur réseau Supabase.',
    }
  }
}

export async function fetchBestScore(): Promise<{ data: number | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: 'Classement en ligne non configuré.' }
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle<{ score: number }>()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data?.score ?? 0, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Erreur réseau Supabase.',
    }
  }
}
