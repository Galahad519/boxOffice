import { Film } from 'lucide-react'
import { CategorySelectScreen } from '../../components/CategorySelectScreen'
import { PosterCard } from '../../components/PosterCard'
import { ScoreBoard } from '../../components/ScoreBoard'
import { VsDivider } from '../../components/VsDivider'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import { Toaster } from '../../components/ui/sonner'
import { useBoxOfficeGame } from '../../hooks/useBoxOfficeGame'

export function BoxOfficeDuel() {
  const {
    bestScore,
    categories,
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
    selectedCategory,
    showCategorySelect,
    startCategory,
    timeLeft,
    wasCorrect,
  } = useBoxOfficeGame()

  if (screen === 'category-select') {
    return (
      <>
        <CategorySelectScreen
          categories={categories}
          selectedCategoryId={selectedCategory.id}
          onSelectCategory={startCategory}
        />
        <Toaster />
      </>
    )
  }

  if (!champion || !challenger) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_top,#221e2a_0%,#15131a_65%)] px-4 text-center text-[#f3eee3]">
        <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-widest text-[#e8b339] drop-shadow-[0_0_18px_rgba(232,179,57,0.35)]">
          <Film size={20} strokeWidth={2.2} />
          <span>DUEL BOX-OFFICE</span>
        </div>
        <div className="flex w-full max-w-[560px] flex-col items-center gap-3.5 sm:flex-row sm:items-stretch sm:justify-center">
          <PosterSkeleton />
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2 border-[#c8253d] bg-[#c8253d]/10 text-sm font-bold text-[#c8253d]">
            VS
          </span>
          <PosterSkeleton />
        </div>
        {isBuildingPool && (
          <p className="m-0 font-mono text-xs text-[#e8b339]">
            {pool.length} film{pool.length === 1 ? '' : 's'} prêt{pool.length === 1 ? '' : 's'}
          </p>
        )}
        <Toaster />
      </div>
    )
  }

  const revealed = phase !== 'guessing'
  const championIsWinner = revealed && champion.revenue >= challenger.revenue
  const challengerIsWinner = revealed && challenger.revenue >= champion.revenue
  const championIsLoserPick = revealed && pickSide === 'champion' && wasCorrect === false
  const challengerIsLoserPick = revealed && pickSide === 'challenger' && wasCorrect === false
  const usingPool = pool.length >= 2

  return (
    <>
      <div className="flex min-h-screen flex-col items-center gap-3.5 bg-[radial-gradient(ellipse_at_top,#221e2a_0%,#15131a_65%)] px-4 py-7 text-[#f3eee3] sm:py-9">
        <header className="max-w-[480px] text-center">
          <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-widest text-[#e8b339] drop-shadow-[0_0_18px_rgba(232,179,57,0.35)]">
            <Film size={20} strokeWidth={2.2} />
            <span>DUEL BOX-OFFICE</span>
          </div>
          <p className="mt-1.5 text-[13px] text-[#9a93a6]">
            Quel film a rapporté le plus au box-office mondial ?
          </p>
        </header>

        <ScoreBoard score={score} bestScore={bestScore} timeLeft={timeLeft} />

        <div className="flex w-full max-w-[560px] flex-col items-center gap-3.5 sm:flex-row sm:items-stretch sm:justify-center">
          <PosterCard
            key={champion.id}
            movie={champion}
            revealed={revealed}
            disabled={phase !== 'guessing' || isGameOver}
            isWinner={championIsWinner}
            isLoserPick={championIsLoserPick}
            onClick={() => handlePick('champion')}
          />

          <VsDivider revealed={revealed} />

          <PosterCard
            key={challenger.id}
            movie={challenger}
            revealed={revealed}
            disabled={phase !== 'guessing' || isGameOver}
            isWinner={challengerIsWinner}
            isLoserPick={challengerIsLoserPick}
            onClick={() => handlePick('challenger')}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={showCategorySelect}
          disabled={!isGameOver}
          className="border-[#e8b339]/35 bg-[#241f2c] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#e8b339] hover:border-[#e8b339] hover:bg-[#2c2733] hover:text-[#e8b339] disabled:cursor-not-allowed disabled:border-white/10 disabled:text-[#9a93a6]/45 disabled:hover:bg-[#241f2c]"
        >
          Changer de catégorie
        </Button>

        <div className="flex min-h-[50px] flex-col items-center justify-center gap-2.5 text-center">
          {isGameOver && (
            <>
              <div className="rounded-md border-[3px] border-[#e8b339] px-5 py-2 text-[22px] font-black tracking-[0.12em] text-[#e8b339]">
                TEMPS ÉCOULÉ
              </div>
              <Button
                type="button"
                onClick={restartGame}
                className="bg-[#e8b339] px-4 py-2 text-sm font-bold text-[#15131a] hover:bg-[#f1c85b]"
              >
                Rejouer
              </Button>
            </>
          )}
          {!isGameOver && phase === 'guessing' && (
            <p className="m-0 text-[13px] text-[#9a93a6]">
              Clique sur l'affiche qui, selon toi, a généré le plus de recettes.
            </p>
          )}
          {!isGameOver && phase === 'revealed' && wasCorrect && <ResultStamp variant="correct" label="BONNE PIOCHE" />}
          {!isGameOver && phase === 'revealed' && !wasCorrect && <ResultStamp variant="wrong" label="RATÉ" />}
        </div>

        <p className="m-0 max-w-[420px] text-center text-[10.5px] text-[#9a93a6]/70">
          {usingPool
            ? 'Films, affiches, budgets et recettes en direct depuis le catalogue TMDB.'
            : 'Chiffres de budget et de recettes mondiales approximatifs, à titre d’illustration.'}{' '}
          Ce produit utilise l'API TMDB mais n'est ni avalisé ni certifié par TMDB.
        </p>
      </div>
      <Toaster />
    </>
  )
}

function PosterSkeleton() {
  return (
    <div className="w-full max-w-[260px] overflow-hidden rounded-2xl border-2 border-white/10 bg-[#241f2c]">
      <Skeleton className="min-h-[230px] rounded-none bg-[#2c2733]" />
      <div className="space-y-2 border-t border-dashed border-[#f3eee3]/25 bg-[#2c2733] px-3.5 py-3">
        <Skeleton className="h-3 w-24 bg-[#9a93a6]/25" />
        <Skeleton className="h-3 w-32 bg-[#9a93a6]/20" />
      </div>
    </div>
  )
}

function ResultStamp({ variant, label }: { variant: 'correct' | 'wrong'; label: string }) {
  return (
    <div
      className={[
        '-rotate-3 rounded-md border-[3px] px-5 py-2 text-[22px] font-black tracking-[0.12em]',
        variant === 'correct' ? 'border-[#5fa776] text-[#5fa776]' : 'border-[#c8253d] text-[#c8253d]',
      ].join(' ')}
    >
      {label}
    </div>
  )
}
