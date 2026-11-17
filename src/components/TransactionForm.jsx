import { useState } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories'
import { todayStr } from '../utils/format'

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayStr())
  const [error, setError] = useState('')

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const switchType = (t) => {
    setType(t)
    setCategory((t === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0].id)
  }

  const handleAmount = (e) => {
    const digits = e.target.value.replace(/\D/g, '')
    setAmount(digits ? Number(digits).toLocaleString('ru-RU').replace(/ /g, ' ') : '')
  }

  const submit = (e) => {
    e.preventDefault()
    const value = Number(amount.replace(/\s/g, ''))
    if (!value || value <= 0) return setError("Summani to'g'ri kiriting")
    if (!date) return setError('Sanani tanlang')
    onAdd({
      id: crypto.randomUUID(),
      type,
      amount: value,
      category,
      note: note.trim(),
      date,
    })
    setAmount('')
    setNote('')
    setError('')
  }

  const field =
    'neu-inset w-full rounded-xl px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40'

  return (
    <form onSubmit={submit} className="neu space-y-5 p-6">
      <h2 className="text-base font-semibold">Yangi yozuv</h2>

      <div className="neu-inset grid grid-cols-2 gap-2 rounded-xl p-1.5" role="tablist">
        {[
          ['expense', 'Xarajat'],
          ['income', 'Daromad'],
        ].map(([t, label]) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={type === t}
            onClick={() => switchType(t)}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              type === t
                ? t === 'expense'
                  ? 'neu-sm text-rose-600'
                  : 'neu-sm text-emerald-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-600">Summa (so'm)</span>
        <input
          inputMode="numeric"
          value={amount}
          onChange={handleAmount}
          placeholder="Masalan: 50 000"
          className={field}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-600">Toifa</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Sana</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Izoh</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
            placeholder="Ixtiyoriy"
            className={field}
          />
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        className="neu-btn w-full rounded-xl py-3 text-sm font-semibold text-emerald-700"
      >
        Qo'shish
      </button>
    </form>
  )
}
