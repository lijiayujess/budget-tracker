<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="onCancel"
  >
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div class="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl mb-4">
        ⚠️
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ message }}
      </p>
      <div class="flex gap-3">
        <button
          class="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          @click="onCancel"
        >
          取消
        </button>
        <button
          class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          @click="onConfirm"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '确认删除' },
  message: { type: String, default: '删除后将无法恢复，是否继续？' }
})
const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>
