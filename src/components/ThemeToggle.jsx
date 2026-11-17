import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'xarajatlar:theme'
const FALL_MS = 1800
const RISE_MS = 2000

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Sun() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  )
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.8 6.8 0 0 0 9.7 9.7z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const [phase, setPhase] = useState('idle') // idle | falling | rising
  const [pulse, setPulse] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t
    setTheme(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* saqlab bo'lmadi — muhim emas */
    }
  }

  const toggle = () => {
    if (phase !== 'idle') return
    const next = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    if (prefersReducedMotion()) return applyTheme(next)

    root.classList.add('theme-transition')
    const total = next === 'dark' ? FALL_MS : RISE_MS
    setPhase(next === 'dark' ? 'falling' : 'rising')
    // Bola teshikka tushayotganda tun, teshikdan chiqayotganda kun bo'ladi
    later(() => applyTheme(next), next === 'dark' ? 1250 : 450)
    // Quyoshdan chiqqanda / quyoshga kirganda tugma "puflab" qo'yadi
    const pulseAt = next === 'dark' ? 150 : Math.round(total * 0.84)
    later(() => setPulse(true), pulseAt)
    later(() => setPulse(false), pulseAt + 450)
    later(() => {
      setPhase('idle')
      root.classList.remove('theme-transition')
    }, total + 80)
  }

  const stickClass = phase === 'falling' ? 'falling' : phase === 'rising' ? 'rising' : theme === 'dark' ? 'is-dark' : 'is-light'
  const isDark = theme === 'dark'

  return (
    <div className="neu relative h-[76px] w-[212px] shrink-0" style={{ borderRadius: '1.4rem' }}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Kunduzgi rejimga o‘tish' : 'Tungi rejimga o‘tish'}
        onClick={toggle}
        className={`neu-btn absolute left-3.5 top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${pulse ? 'sun-pulse' : ''}`}
      >
        <span key={theme} className={`theme-icon ${isDark ? 'text-sky-400' : 'text-amber-500'}`}>
          {isDark ? <Moon /> : <Sun />}
        </span>
      </button>

      <svg viewBox="0 0 212 76" className="pointer-events-none absolute left-0 top-0 h-[76px] w-[212px]" aria-hidden="true">
        <defs>
          <clipPath id="stage-clip">
            <rect x="0" y="0" width="212" height="63" />
          </clipPath>
        </defs>

        {/* teshik */}
        <ellipse cx="172" cy="62" rx="17" ry="5" className="hole" />

        {/* tayoqcha bola */}
        <g clipPath="url(#stage-clip)">
          <g className={`stick ${stickClass}`}>
            <g className="stick-body">
              <circle cx="0" cy="-30" r="5" className="stick-fill" />
              <line x1="0" y1="-25" x2="0" y2="-12" className="stick-line" />
              <g transform="translate(0 -22)">
                <line x1="0" y1="0" x2="-1" y2="9" className="stick-line arm arm-a" />
                <line x1="0" y1="0" x2="1" y2="9" className="stick-line arm arm-b" />
              </g>
              <g transform="translate(0 -12)">
                <line x1="0" y1="0" x2="0" y2="12" className="stick-line leg leg-a" />
                <line x1="0" y1="0" x2="0" y2="12" className="stick-line leg leg-b" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
