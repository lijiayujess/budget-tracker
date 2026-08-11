<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- PC 侧边栏 -->
    <aside class="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl">
          💰
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">记账本</span>
      </div>

      <nav class="flex-1 px-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium',
            isActive(item.to)
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <span class="text-xl">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          @click="toggleTheme"
        >
          <span class="text-xl">{{ isDark ? '🌙' : '☀️' }}</span>
          {{ isDark ? '深色模式' : '浅色模式' }}
        </button>
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          @click="handleLogout"
        >
          <span class="text-xl">🚪</span>
          退出登录
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 min-w-0 pb-20 md:pb-0">
      <header class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
            💰
          </div>
          <span class="font-bold text-gray-900 dark:text-white">记账本</span>
        </div>
        <button
          class="p-2 rounded-lg text-gray-600 dark:text-gray-400"
          @click="toggleTheme"
        >
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </header>

      <div class="p-4 md:p-8 max-w-7xl mx-auto">
        <router-view />
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-bottom z-20">
      <div class="flex justify-around items-center">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          :class="[
            'flex flex-col items-center py-2 px-3 flex-1 transition',
            isActive(item.to)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-xs mt-1">{{ item.label }}</span>
        </router-link>
        <button
          class="flex flex-col items-center py-2 px-3 flex-1 text-gray-500 dark:text-gray-400"
          @click="handleLogout"
        >
          <span class="text-xl">🚪</span>
          <span class="text-xs mt-1">退出</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { mode, toggleTheme } = useTheme()

const isDark = computed(() => mode.value === 'dark')

const navItems = [
  { label: '首页', icon: '📊', to: '/' },
  { label: '账单', icon: '📋', to: '/transactions' },
  { label: '统计', icon: '📈', to: '/statistics' }
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

async function handleLogout() {
  if (!confirm('确定要退出登录吗？')) return
  await authStore.signOut()
  router.push('/login')
}
</script>
