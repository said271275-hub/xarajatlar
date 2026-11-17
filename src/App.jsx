import { useMemo, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryChart from './components/CategoryChart'
import { monthKey, monthLabel, todayStr } from './utils/format'
import Select from './components/Select'

export default function App() {
  const [transactions, setTransactions] = useLocalStorage('xarajatlar:v1', [])
  const [month, setMonth] = useState(monthKey(todayStr()))

  const months = useMemo(() => {
    // Joriy oy + oldingi 5 oy + yozuvi bor oylar
    const set = new Set(transactions.map((t) => monthKey(t.date)))
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    return [...set].sort().reverse()
  }, [transactions])

  const monthItems = useMemo(
    () => transactions.filter((t) => monthKey(t.date) === month),
    [transactions, month],
  )
  const expenses = monthItems.filter((t) => t.type === 'expense')
  const sum = (arr) => arr.reduce((s, t) => s + t.amount, 0)

  const add = (t) => {
    setTransactions((prev) => [t, ...prev])
    setMonth(monthKey(t.date))
  }
  const remove = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Xarajatlar hisobi</h1>
          <p className="mt-1 text-sm text-slate-500">Daromad va xarajatlaringizni bir joyda nazorat qiling</p>
        </div>
        <Select
          label="Oy"
          variant="raised"
          align="right"
          value={month}
          onChange={setMonth}
          options={months.map((m) => ({ value: m, label: monthLabel(m) }))}
        />
      </header>

      <Summary income={sum(monthItems.filter((t) => t.type === 'income'))} expense={sum(expenses)} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <TransactionForm onAdd={add} />
        </div>
        <div className="space-y-6">
          <CategoryChart expenses={expenses} />
          <TransactionList items={monthItems} onDelete={remove} />
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-slate-500">
        Ma'lumotlar faqat shu brauzerda (localStorage) saqlanadi.
      </footer>
    </div>
  )
}
