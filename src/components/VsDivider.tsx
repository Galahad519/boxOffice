type VsDividerProps = {
  revealed: boolean
}

export function VsDivider({ revealed }: VsDividerProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 sm:flex-col">
      <div className="flex flex-row gap-1.5 sm:flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={[
              'h-[7px] w-[7px] rounded-full',
              revealed ? 'animate-pulse bg-[#e8b339] shadow-[0_0_8px_rgba(232,179,57,0.7)]' : 'bg-white/10',
            ].join(' ')}
            style={{ animationDelay: `${index * 90}ms` }}
          />
        ))}
      </div>
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2 border-[#c8253d] bg-[#c8253d]/10 text-sm font-bold text-[#c8253d]">
        VS
      </span>
    </div>
  )
}
