export const formatMoney = (n) =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/ /g, ' ') + " so'm"

const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

export const monthKey = (dateStr) => dateStr.slice(0, 7) // "2026-11"

export const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export const todayStr = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const formatDay = (dateStr) => {
  const [y, m, d] = dateStr.split('-')
  return `${Number(d)}-${MONTHS[Number(m) - 1].toLowerCase()}, ${y}`
}
