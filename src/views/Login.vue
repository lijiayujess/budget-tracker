<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 text-3xl mb-4">
          💰
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          欢迎回来
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          登录你的记账本账号
        </p>
      </div>

      <form
        class="space-y-5"
        @submit.prevent="handleLogin"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="name@example.com"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            placeholder="请输入密码"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          >
        </div>

        <div
          v-if="error"
          class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg transition flex items-center justify-center"
        >
          <span
            v-if="loading"
            class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
          />
          登录
        </button>
      </form>

      <div class="mt-6 flex items-center justify-between text-sm">
        <router-link
          to="/register"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          注册账号
        </router-link>
        <router-link
          to="/reset-password"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          忘记密码？
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.signIn(form)
    router.push('/')
  } catch (err) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
