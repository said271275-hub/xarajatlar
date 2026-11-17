import { useMemo } from 'react'
import { getCategory } from '../utils/categories'
import { formatMoney } from '../utils/format'

const R = 70
const C = 2 * Math.PI * R

export default function CategoryChart({ expenses }) {
  const { slices, total } = useMemo(() => {
    const map = {}
    expenses.forEach((t) => (map[t.category] = (map[t.category] ?? 0) + t.amount))
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    let offset = 0
    const slices = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([id, sum]) => {
        const len = (sum / total) * C
        const s = { ...getCategory(id), sum, pct: (sum / total) * 100, len, offset }
        offset += len
        return s
      })
    return { slices, total }
  }, [expenses])

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold">Xarajatlar toifalar bo'yicha</h2>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Bu oyda xarajat yo'q</p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0 -rotate-90" role="img" aria-label="Doira diagramma">
            <circle cx="100" cy="100" r={R} fill="none" stroke="#f1f5f9" strokeWidth="28" />
            {slices.map((s) => (
              <circle
                key={s.id}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="28"
                strokeDasharray={`${s.len} ${C - s.len}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>

          <ul className="w-full space-y-2.5 text-sm">
            {slices.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="flex-1 truncate">
                  {s.icon} {s.name}
                </span>
                <span className="tabular-nums text-slate-500">{s.pct.toFixed(0)}%</span>
                <span className="w-28 text-right font-medium tabular-nums">{formatMoney(s.sum)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
