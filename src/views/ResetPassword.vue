<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 text-3xl mb-4">
          🔐
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          重置密码
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          我们将向你的邮箱发送重置链接
        </p>
      </div>

      <form
        v-if="!sent"
        class="space-y-5"
        @submit.prevent="handleReset"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="name@example.com"
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
          发送重置链接
        </button>
      </form>

      <div
        v-else
        class="text-center py-8"
      >
        <div class="text-5xl mb-4">
          📧
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          邮件已发送
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          请查收邮件并点击链接重置密码
        </p>
        <router-link
          to="/login"
          class="inline-block mt-6 text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          返回登录
        </router-link>
      </div>

      <div
        v-if="!sent"
        class="mt-6 text-center text-sm"
      >
        <span class="text-gray-500 dark:text-gray-400">记起密码了？</span>
        <router-link
          to="/login"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-400 ml-1"
        >
          返回登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function handleReset() {
  error.value = ''
  loading.value = true
  try {
    await authStore.resetPassword(email.value)
    sent.value = true
  } catch (err) {
    error.value = err.message || '发送失败，请检查邮箱地址'
  } finally {
    loading.value = false
  }
}
</script>
