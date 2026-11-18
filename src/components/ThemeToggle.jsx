import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'xarajatlar:theme'
const LEAVE_MS = 2700 // tun: quyoshdan chiqadi -> doira tagiga boradi -> shoxga ilinib doiraga chiqib ketadi
const ARRIVE_MS = 2700 // kun: doiradan shox orqali tushadi -> quyosh oldiga boradi -> yo'q bo'ladi

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
  const [phase, setPhase] = useState('idle') // idle | leaving | arriving
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
    const total = next === 'dark' ? LEAVE_MS : ARRIVE_MS
    setPhase(next === 'dark' ? 'leaving' : 'arriving')
    // Bola doiraga chiqib ketayotganda tun, doiradan tushib kelayotganda kun bo'ladi
    later(() => applyTheme(next), next === 'dark' ? 1700 : 400)
    // Bola quyoshdan chiqqanda / quyoshga kirganda tugma "puflab" qo'yadi
    const pulseAt = next === 'dark' ? 150 : 2250
    later(() => setPulse(true), pulseAt)
    later(() => setPulse(false), pulseAt + 450)
    later(() => {
      setPhase('idle')
      root.classList.remove('theme-transition')
    }, total + 80)
  }

  const stickClass = phase === 'leaving' ? 'leaving' : phase === 'arriving' ? 'arriving' : theme === 'dark' ? 'is-dark' : 'is-light'
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
          {/* doira ichiga kirgan qism ko'rinmaydi */}
          <clipPath id="stage-clip">
            <rect x="0" y="7" width="212" height="69" />
          </clipPath>
        </defs>

        {/* tepadagi qora doira */}
        <ellipse cx="150" cy="7" rx="14" ry="4.6" className="hole" />

        {/* doiradan osilib turgan shoxcha */}
        <path d="M 150 9 C 148 14, 152 19, 150 26" className="twig" />
        <g className="leaf">
          <ellipse cx="155" cy="15" rx="4" ry="2" transform="rotate(-35 155 15)" />
          <ellipse cx="145" cy="19" rx="4" ry="2" transform="rotate(35 145 19)" />
          <ellipse cx="154" cy="23" rx="3.4" ry="1.8" transform="rotate(-30 154 23)" />
        </g>

        {/* tayoqcha bola */}
        <g clipPath="url(#stage-clip)">
          <g className={`stick ${stickClass}`}>
            <g className="stick-body">
              <circle cx="0" cy="-30" r="5" className="stick-fill" />
              <line x1="0" y1="-25" x2="0" y2="-12" className="stick-line" />
              {/* qo'llar pastda (yurganda) */}
              <g transform="translate(0 -22)" className="arms-down">
                <line x1="0" y1="0" x2="-4" y2="9" className="stick-line arm arm-a" />
                <line x1="0" y1="0" x2="4" y2="9" className="stick-line arm arm-b" />
              </g>
              {/* qo'llar tepada (shoxchani ushlab turganda) */}
              <g transform="translate(0 -23)" className="arms-up">
                <line x1="-1" y1="0" x2="-3.5" y2="-18" className="stick-line" />
                <line x1="1" y1="0" x2="3.5" y2="-18" className="stick-line" />
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
