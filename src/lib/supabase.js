import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('请在 .env 文件中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

// 自定义存储适配器：优先使用 localStorage，不可用时降级到内存存储
// 解决 Safari ITP / 微信内置浏览器 / 无痕模式下的存储限制问题
function createAuthStorage() {
  const memoryStore = new Map()

  const storage = {
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key)
        if (value) return value
      } catch (e) {
        // localStorage 不可用（如 ITP 限制、隐私模式）
      }
      return memoryStore.get(key) ?? null
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch (e) {
        // localStorage 写入失败，使用内存兜底
      }
      memoryStore.set(key, value)
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        // 忽略错误
      }
      memoryStore.delete(key)
    }
  }

  return storage
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createAuthStorage(),
    storageKey: 'budget-tracker-auth-token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
