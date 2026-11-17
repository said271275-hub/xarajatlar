import { formatMoney } from '../utils/format'

function Card({ label, value, tone, icon }) {
  const tones = {
    income: 'text-emerald-600',
    expense: 'text-rose-600',
    balance: 'text-slate-800',
  }
  return (
    <div className={`neu p-6 ${tones[tone]}`}>
      <div className="flex items-center justify-between text-sm font-medium opacity-80">
        <span>{label}</span>
        <span aria-hidden className="neu-inset flex h-9 w-9 items-center justify-center rounded-full text-base">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
    </div>
  )
}

export default function Summary({ income, expense }) {
  const balance = income - expense
  return (
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Umumiy hisob">
      <Card label="Daromad" value={formatMoney(income)} tone="income" icon="⬆️" />
      <Card label="Xarajat" value={formatMoney(expense)} tone="expense" icon="⬇️" />
      <Card
        label="Qoldiq"
        value={(balance < 0 ? '− ' : '') + formatMoney(Math.abs(balance))}
        tone="balance"
        icon="💰"
      />
    </section>
  )
}
