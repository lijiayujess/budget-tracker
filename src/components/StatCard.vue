<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ title }}
        </p>
        <p
          class="text-2xl font-bold mt-1"
          :class="valueClass"
        >
          {{ formattedValue }}
        </p>
      </div>
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        :class="iconBgClass"
      >
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  title: { type: String, default: '' },
  value: { type: Number, default: 0 },
  icon: { type: String, default: '' },
  type: { type: String, default: 'neutral' }
})

const formattedValue = computed(() => formatCurrency(props.value))

const valueClass = computed(() => {
  switch (props.type) {
    case 'income': return 'text-green-600 dark:text-green-400'
    case 'expense': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-900 dark:text-white'
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'income': return 'bg-green-100 dark:bg-green-900/30'
    case 'expense': return 'bg-red-100 dark:bg-red-900/30'
    default: return 'bg-primary-100 dark:bg-primary-900/30'
  }
})
</script>
