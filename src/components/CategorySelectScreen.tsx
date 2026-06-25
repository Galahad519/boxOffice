import { Film, Ticket } from 'lucide-react'
import type { Category, CategoryId } from '../data/categories'

type CategorySelectScreenProps = {
  categories: Category[]
  selectedCategoryId: CategoryId
  onSelectCategory: (categoryId: CategoryId) => void
}

export function CategorySelectScreen({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySelectScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-[radial-gradient(ellipse_at_top,#221e2a_0%,#15131a_65%)] px-4 py-8 text-center text-[#f3eee3]">
      <header className="max-w-[620px]">
        <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-widest text-[#e8b339] drop-shadow-[0_0_18px_rgba(232,179,57,0.35)]">
          <Film size={20} strokeWidth={2.2} />
          <span>DUEL BOX-OFFICE</span>
        </div>
        <p className="mt-2 text-sm text-[#9a93a6]">
          Choisis une salle, puis marque le plus de bonnes réponses en 60 secondes.
        </p>
      </header>

      <div className="grid w-full max-w-[760px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const selected = category.id === selectedCategoryId

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={[
                'relative overflow-hidden rounded-lg border border-dashed px-3 py-4 text-left transition focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b339]',
                selected
                  ? 'border-[#e8b339] bg-[#e8b339] text-[#15131a] shadow-[0_0_20px_rgba(232,179,57,0.25)]'
                  : 'border-[#f3eee3]/25 bg-[#241f2c] text-[#f3eee3] hover:-translate-y-0.5 hover:border-[#e8b339]/70',
              ].join(' ')}
            >
              <span className="absolute bottom-2 left-2 top-2 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={[
                      'h-1.5 w-1.5 rounded-full',
                      selected ? 'bg-[#15131a]/35' : 'bg-black/45',
                    ].join(' ')}
                  />
                ))}
              </span>

              <span className="ml-5 flex items-center gap-2 text-[11px] uppercase tracking-wide opacity-70">
                <Ticket size={13} />
                Catégorie
              </span>
              <span className="ml-5 mt-2 block text-lg font-black tracking-wide">
                {category.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
