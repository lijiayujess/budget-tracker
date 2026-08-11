<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 text-3xl mb-4">
          📝
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          创建账号
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          开始记录你的每一笔收支
        </p>
      </div>

      <form
        class="space-y-5"
        @submit.prevent="handleRegister"
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
            placeholder="至少6位字符"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">确认密码</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            minlength="6"
            placeholder="再次输入密码"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          >
        </div>

        <div
          v-if="error"
          class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg"
        >
          注册成功，请前往邮箱查收验证邮件，验证后即可登录。
        </div>

        <button
          type="submit"
          :disabled="loading || success"
          class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg transition flex items-center justify-center"
        >
          <span
            v-if="loading"
            class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
          />
          注册
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
        <span class="text-gray-500 dark:text-gray-400">已有账号？</span>
        <router-link
          to="/login"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-400 ml-1"
        >
          立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = reactive({ email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  error.value = ''
  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  loading.value = true
  try {
    await authStore.signUp({ email: form.email, password: form.password })
    success.value = true
  } catch (err) {
    error.value = err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
