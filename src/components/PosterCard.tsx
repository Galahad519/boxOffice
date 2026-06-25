import { Crown, Lock } from 'lucide-react'
import { useState } from 'react'
import { formatMoney } from '../lib/movies'
import type { Movie } from '../types/movie'

type PosterCardProps = {
  movie: Movie
  revealed: boolean
  disabled: boolean
  isWinner: boolean
  isLoserPick: boolean
  onClick: () => void
}

export function PosterCard({
  movie,
  revealed,
  disabled,
  isWinner,
  isLoserPick,
  onClick,
}: PosterCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = Boolean(movie.posterUrl) && !imgFailed

  return (
    <button
      type="button"
      className={[
        'relative w-full max-w-[260px] overflow-hidden rounded-2xl border-2 bg-[#241f2c] text-left transition duration-150 focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#e8b339]',
        disabled ? 'cursor-default' : 'cursor-pointer hover:-translate-y-0.5 hover:border-[#e8b339]/50',
        isWinner
          ? 'border-[#5fa776] shadow-[0_0_0_1px_#5fa776,0_12px_28px_-8px_rgba(95,167,118,0.45)]'
          : 'border-white/10',
        isLoserPick ? 'border-[#c8253d] opacity-85' : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {isWinner && (
        <span className="absolute right-2.5 top-2.5 z-30 flex items-center gap-1 rounded-full bg-[#5fa776] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0e1f15]">
          <Crown size={12} /> Gagnant
        </span>
      )}

      <div
        className="relative isolate flex min-h-[230px] flex-col justify-end overflow-hidden px-3.5 pb-7 pl-6 pt-5"
        style={!showImage ? { background: `linear-gradient(160deg, ${movie.from}, ${movie.to})` } : undefined}
      >
        {showImage && (
          <>
            <img
              className="absolute inset-0 z-0 h-full w-full object-cover"
              src={movie.posterUrl ?? ''}
              alt={`Affiche du film ${movie.title}`}
              onError={() => setImgFailed(true)}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#08060a]/90 via-[#08060a]/35 to-transparent" />
          </>
        )}

        <div className="absolute bottom-2.5 left-1.5 top-2.5 z-20 flex flex-col justify-between">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-black/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
            />
          ))}
        </div>

        <div className="relative z-20 mb-2">
          <p className="m-0 text-[21px] font-bold leading-tight tracking-wide text-[#f3eee3] shadow-black drop-shadow-md">
            {movie.title}
          </p>
          <p className="mt-0.5 font-mono text-xs text-[#f3eee3]/80">{movie.year}</p>
        </div>
        <p className="relative z-20 m-0 text-[11px] uppercase tracking-wide text-[#f3eee3]/70">
          {movie.tag}
        </p>
      </div>

      <div className="border-t border-dashed border-[#f3eee3]/25 bg-[#2c2733] px-3.5 py-3">
        <MoneyRow label="Budget" value={formatMoney(movie.budget)} />
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] uppercase tracking-wide text-[#9a93a6]">Recettes</span>
          {revealed ? (
            <span className="font-mono text-[13px] text-[#e8b339]">{formatMoney(movie.revenue)}</span>
          ) : (
            <span className="flex items-center gap-1 font-mono text-[13px] text-[#9a93a6]">
              <Lock size={12} /> ???
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] uppercase tracking-wide text-[#9a93a6]">{label}</span>
      <span className="font-mono text-[13px] text-[#f3eee3]">{value}</span>
    </div>
  )
}
