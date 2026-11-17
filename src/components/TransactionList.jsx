import { getCategory } from '../utils/categories'
import { formatDay, formatMoney } from '../utils/format'

export default function TransactionList({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
        <p className="text-3xl">🧾</p>
        <p className="mt-2 text-sm text-slate-500">Bu oyda hali yozuv yo'q. Chapdagi formadan qo'shing.</p>
      </section>
    )
  }

  const groups = items.reduce((acc, t) => {
    ;(acc[t.date] ??= []).push(t)
    return acc
  }, {})

  return (
    <section className="space-y-4">
      {Object.keys(groups)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => (
          <div key={date} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            <h3 className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formatDay(date)}
            </h3>
            <ul className="divide-y divide-slate-100">
              {groups[date].map((t) => {
                const cat = getCategory(t.category)
                const isIncome = t.type === 'income'
                return (
                  <li key={t.id} className="group flex items-center gap-3 px-4 py-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                      style={{ background: cat.color + '1f' }}
                    >
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.note || cat.name}</p>
                      <p className="text-xs text-slate-400">{cat.name}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '−'} {formatMoney(t.amount)}
                    </p>
                    <button
                      onClick={() => onDelete(t.id)}
                      aria-label="O'chirish"
                      className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus:text-rose-600"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
    </section>
  )
}
