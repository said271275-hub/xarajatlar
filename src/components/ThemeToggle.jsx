import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'xarajatlar:theme'
const LEAVE_MS = 2300 // tun: bola shoxga osilib, chiqib ketadi
const ARRIVE_MS = 2300 // kun: bola shox bo'ylab kelib, yerga sakraydi

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
    // Bola shoxdan chiqib ketayotganda tun, shoxdan tushib kelayotganda kun bo'ladi
    const switchAt = next === 'dark' ? 1100 : 400
    later(() => applyTheme(next), switchAt)
    // Mavzu almashganda tugma "puflab" qo'yadi
    later(() => setPulse(true), switchAt)
    later(() => setPulse(false), switchAt + 450)
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
        {/* daraxt shoxi (tepadan o'ngdan chiqib turadi) */}
        <path d="M 232 10 C 192 8, 150 8, 106 12" className="branch" />
        <path d="M 140 9 C 134 14, 130 18, 126 20" className="branch branch-twig" />
        <g className="leaf">
          <ellipse cx="112" cy="9" rx="5" ry="2.6" transform="rotate(-25 112 9)" />
          <ellipse cx="104" cy="14" rx="5" ry="2.6" transform="rotate(20 104 14)" />
          <ellipse cx="124" cy="20" rx="4.5" ry="2.4" transform="rotate(35 124 20)" />
          <ellipse cx="119" cy="12" rx="4.5" ry="2.4" transform="rotate(-40 119 12)" />
          <ellipse cx="150" cy="5" rx="4.5" ry="2.4" transform="rotate(-15 150 5)" />
        </g>

        {/* tayoqcha bola */}
        <g className={`stick ${stickClass}`}>
          <g className="stick-body">
            <circle cx="0" cy="-30" r="5" className="stick-fill" />
            <line x1="0" y1="-25" x2="0" y2="-12" className="stick-line" />
            {/* qo'llar pastda (tik turganda) */}
            <g transform="translate(0 -22)" className="arms-down">
              <line x1="0" y1="0" x2="-4" y2="9" className="stick-line" />
              <line x1="0" y1="0" x2="4" y2="9" className="stick-line" />
            </g>
            {/* qo'llar tepada (shoxni ushlab turganda) */}
            <g transform="translate(0 -23)" className="arms-up">
              <line x1="-1" y1="0" x2="-5" y2="-17" className="stick-line" />
              <line x1="1" y1="0" x2="5" y2="-17" className="stick-line" />
            </g>
            <g transform="translate(0 -12)">
              <line x1="0" y1="0" x2="0" y2="12" className="stick-line leg leg-a" />
              <line x1="0" y1="0" x2="0" y2="12" className="stick-line leg leg-b" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
