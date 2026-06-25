import { Clock, Ticket, Trophy } from 'lucide-react'

type ScoreBoardProps = {
  score: number
  bestScore: number
  timeLeft: number
}

export function ScoreBoard({ score, bestScore, timeLeft }: ScoreBoardProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <ScoreChip icon={<Clock size={14} />} label="Temps" value={`${timeLeft}s`} urgent={timeLeft <= 10} />
      <ScoreChip icon={<Ticket size={14} />} label="Bonnes réponses" value={score} />
      <ScoreChip icon={<Trophy size={14} />} label="Record" value={bestScore} featured />
    </div>
  )
}

function ScoreChip({
  icon,
  label,
  value,
  featured = false,
  urgent = false,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  featured?: boolean
  urgent?: boolean
}) {
  return (
    <div
      className={[
        'flex items-center gap-1.5 rounded-lg border bg-[#241f2c] px-3 py-1.5 text-[11px] uppercase tracking-wide',
        featured ? 'border-[#e8b339]/35 text-[#e8b339]' : 'border-white/10 text-[#9a93a6]',
        urgent ? 'border-[#c8253d]/60 text-[#c8253d]' : '',
      ].join(' ')}
    >
      {icon}
      <span>{label}</span>
      <span className="ml-1 font-mono text-sm text-[#f3eee3]">
        {typeof value === 'number' ? String(value).padStart(3, '0') : value}
      </span>
    </div>
  )
}
