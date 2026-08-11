<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
    <div class="text-5xl mb-4">
      {{ icon }}
    </div>
    <p class="text-base">
      {{ title }}
    </p>
    <p
      v-if="subtitle"
      class="text-sm mt-1"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: '暂无数据' },
  subtitle: { type: String, default: '' }
})
</script>
