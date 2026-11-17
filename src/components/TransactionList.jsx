import { getCategory } from '../utils/categories'
import { formatDay, formatMoney } from '../utils/format'

export default function TransactionList({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <section className="neu p-8 text-center">
        <p className="text-3xl">🧾</p>
        <p className="mt-2 text-sm text-slate-500">Bu oyda hali yozuv yo'q. Formadan yangi yozuv qo'shing.</p>
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
          <div key={date} className="neu overflow-hidden">
            <h3 className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formatDay(date)}
            </h3>
            <ul className="divide-y divide-slate-400/20 px-1 pb-2">
              {groups[date].map((t) => {
                const cat = getCategory(t.category)
                const isIncome = t.type === 'income'
                return (
                  <li key={t.id} className="group flex items-center gap-3 px-4 py-3">
                    <span
                      className="neu-inset flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                    >
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.note || cat.name}</p>
                      <p className="text-xs text-slate-500">{cat.name}</p>
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
                      className="neu-btn flex h-8 w-8 items-center justify-center rounded-full text-xs text-slate-400 hover:text-rose-600 focus:text-rose-600"
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
