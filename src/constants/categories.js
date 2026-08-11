export const EXPENSE_CATEGORIES = [
  { id: 'catering', name: '餐饮', icon: '🍜', color: '#f97316' },
  { id: 'transport', name: '交通', icon: '🚌', color: '#3b82f6' },
  { id: 'shopping', name: '购物', icon: '🛍️', color: '#ec4899' },
  { id: 'housing', name: '住房', icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment', name: '娱乐', icon: '🎬', color: '#f59e0b' },
  { id: 'medical', name: '医疗', icon: '🏥', color: '#ef4444' }
]

export const INCOME_CATEGORIES = [
  { id: 'salary', name: '工资', icon: '💰', color: '#10b981' },
  { id: 'bonus', name: '奖金', icon: '🧧', color: '#14b8a6' }
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function getCategoryById(id) {
  return ALL_CATEGORIES.find(c => c.id === id) || { name: '其他', icon: '📦', color: '#9ca3af' }
}
