export const EXPENSE_CATEGORIES = [
  { id: 'oziq', name: 'Oziq-ovqat', icon: '🛒', color: '#10b981' },
  { id: 'transport', name: 'Transport', icon: '🚕', color: '#3b82f6' },
  { id: 'uy', name: 'Uy-joy', icon: '🏠', color: '#8b5cf6' },
  { id: 'kiyim', name: 'Kiyim', icon: '👕', color: '#ec4899' },
  { id: 'salomatlik', name: 'Salomatlik', icon: '💊', color: '#ef4444' },
  { id: 'talim', name: "Ta'lim", icon: '📚', color: '#f59e0b' },
  { id: 'dam', name: "Ko'ngilochar", icon: '🎬', color: '#06b6d4' },
  { id: 'boshqa', name: 'Boshqa', icon: '📦', color: '#64748b' },
]

export const INCOME_CATEGORIES = [
  { id: 'oylik', name: 'Oylik maosh', icon: '💼', color: '#10b981' },
  { id: 'freelance', name: 'Qo\'shimcha ish', icon: '💻', color: '#3b82f6' },
  { id: 'sovga', name: "Sovg'a", icon: '🎁', color: '#ec4899' },
  { id: 'boshqa-d', name: 'Boshqa', icon: '💰', color: '#64748b' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const getCategory = (id) =>
  ALL_CATEGORIES.find((c) => c.id === id) ?? ALL_CATEGORIES[ALL_CATEGORIES.length - 1]
