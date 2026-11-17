import { useEffect, useRef, useState } from 'react'
import { MONTHS, formatDay, todayStr } from '../utils/format'

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
const pad = (n) => String(n).padStart(2, '0')
const toStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

export default function DatePicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const [y, m] = value.split('-').map(Number)
    return { y, m: m - 1 }
  })
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const openPicker = () => {
    const [y, m] = value.split('-').map(Number)
    setView({ y, m: m - 1 })
    setOpen(true)
  }

  const shift = (delta) =>
    setView(({ y, m }) => {
      const t = m + delta
      return { y: y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 }
    })

  const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // dushanba boshlanadi
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const today = todayStr()

  const pick = (d) => {
    onChange(toStr(view.y, view.m, d))
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className={`relative ${open ? 'z-30' : ''}`}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="neu-inset flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      >
        <span className="truncate">{formatDay(value)}</span>
        <span aria-hidden>📅</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Sana tanlash"
          className="neu absolute left-0 z-30 mt-3 w-72 p-4"
          style={{ borderRadius: '1.25rem' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label="Oldingi oy"
              className="neu-btn flex h-8 w-8 items-center justify-center rounded-full text-slate-600"
            >
              ‹
            </button>
            <p className="text-sm font-semibold">
              {MONTHS[view.m]} {view.y}
            </p>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="Keyingi oy"
              className="neu-btn flex h-8 w-8 items-center justify-center rounded-full text-slate-600"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 font-semibold text-slate-500">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />
              const str = toStr(view.y, view.m, d)
              const isSel = str === value
              const isToday = str === today
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pick(d)}
                  className={`h-9 rounded-full text-sm transition ${
                    isSel
                      ? 'neu-inset font-bold text-emerald-700'
                      : 'text-slate-700 hover:bg-white/60'
                  } ${isToday && !isSel ? 'font-bold text-emerald-600' : ''}`}
                >
                  {d}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onChange(today)
              setOpen(false)
            }}
            className="neu-btn mt-3 w-full rounded-xl py-2 text-sm font-medium text-emerald-700"
          >
            Bugun
          </button>
        </div>
      )}
    </div>
  )
}
