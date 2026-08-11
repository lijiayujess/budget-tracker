<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const authStore = useAuthStore()
const { initTheme } = useTheme()

onMounted(() => {
  authStore.init()
  initTheme()
})
</script>
