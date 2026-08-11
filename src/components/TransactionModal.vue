<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="close"
  >
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? '编辑账单' : '新增账单' }}
        </h3>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          @click="close"
        >
          ✕
        </button>
      </div>

      <form
        class="p-6 space-y-4"
        @submit.prevent="handleSubmit"
      >
        <!-- 类型切换 -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            type="button"
            :class="form.type === 'expense' ? 'bg-white dark:bg-gray-600 text-red-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
            class="py-2 rounded-md text-sm font-medium transition"
            @click="form.type = 'expense'"
          >
            支出
          </button>
          <button
            type="button"
            :class="form.type === 'income' ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
            class="py-2 rounded-md text-sm font-medium transition"
            @click="form.type = 'income'"
          >
            收入
          </button>
        </div>

        <!-- 金额 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">金额</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              class="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
          </div>
        </div>

        <!-- 分类 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
          <select
            v-model="form.category"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option
              v-for="cat in currentCategories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- 日期 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日期</label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
        </div>

        <!-- 备注 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">备注</label>
          <input
            v-model="form.note"
            type="text"
            maxlength="100"
            placeholder="可选"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
        </div>

        <div
          v-if="error"
          class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
        >
          {{ error }}
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            @click="close"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg transition flex items-center justify-center"
          >
            <span
              v-if="submitting"
              class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
            />
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useTransactionStore } from '@/stores/transactions'

const props = defineProps({
  transaction: { type: Object, default: null }
})
const emit = defineEmits(['close', 'saved'])

const transactionStore = useTransactionStore()

const isEdit = computed(() => !!props.transaction)
const currentCategories = computed(() =>
  form.type === 'income' ? transactionStore.incomeCategories : transactionStore.expenseCategories
)

const today = new Date().toISOString().split('T')[0]
const form = reactive({
  type: 'expense',
  amount: '',
  category: '',
  date: today,
  note: ''
})

watch(() => props.transaction, (tx) => {
  if (tx) {
    form.type = tx.type
    form.amount = tx.amount
    form.category = tx.category
    form.date = tx.date
    form.note = tx.note || ''
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => form.type, (type) => {
  const list = type === 'income' ? transactionStore.incomeCategories : transactionStore.expenseCategories
  form.category = list[0].id
})

const submitting = ref(false)
const error = ref('')

function resetForm() {
  form.type = 'expense'
  form.amount = ''
  form.category = transactionStore.expenseCategories[0].id
  form.date = today
  form.note = ''
}

function close() {
  emit('close')
}

async function handleSubmit() {
  error.value = ''
  if (!form.amount || form.amount <= 0) {
    error.value = '请输入有效的金额'
    return
  }
  if (!form.category) {
    error.value = '请选择分类'
    return
  }

  submitting.value = true
  try {
    const payload = {
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      note: form.note.trim()
    }
    if (isEdit.value) {
      await transactionStore.updateTransaction(props.transaction.id, payload)
    } else {
      await transactionStore.addTransaction(payload)
    }
    emit('saved')
    close()
  } catch (err) {
    error.value = err.message || '保存失败，请重试'
  } finally {
    submitting.value = false
  }
}
</script>
