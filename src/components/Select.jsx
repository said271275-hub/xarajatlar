import { useEffect, useRef, useState } from 'react'

export default function Select({ value, onChange, options, label, variant = 'inset', align = 'left' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)
  const listRef = useRef(null)

  const selIndex = Math.max(0, options.findIndex((o) => o.value === value))
  const selected = options[selIndex]

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const openMenu = () => {
    setActive(selIndex)
    setOpen(true)
  }
  const choose = (i) => {
    onChange(options[i].value)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'Tab') setOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    }
  }

  const trigger =
    variant === 'inset'
      ? 'neu-inset w-full rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-emerald-500/40'
      : 'neu-btn rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-emerald-500/40'

  return (
    <div ref={wrapRef} className={`relative ${open ? 'z-30' : ''} ${variant === 'inset' ? 'w-full' : ''}`}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex items-center justify-between gap-3 text-left text-sm font-medium text-slate-700 outline-none ${trigger}`}
      >
        <span className="truncate">{selected?.label}</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          className={`neu absolute z-30 mt-3 max-h-64 w-max min-w-full space-y-1 overflow-auto p-2.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{ borderRadius: '1.1rem' }}
        >
          {options.map((o, i) => {
            const isSel = o.value === value
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSel}
                data-index={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-6 rounded-xl px-3.5 py-2.5 text-sm transition ${
                  i === active ? 'neu-inset' : ''
                } ${isSel ? 'font-semibold text-emerald-700' : 'text-slate-700'}`}
              >
                <span className="whitespace-nowrap">{o.label}</span>
                {isSel && <span aria-hidden>✓</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
