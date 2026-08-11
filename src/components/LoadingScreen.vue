<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
    <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '加载中...' }
})
</script>
