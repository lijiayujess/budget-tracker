<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        账单明细
      </h1>
      <button
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
        @click="openAdd"
      >
        + 记一笔
      </button>
    </div>

    <!-- 筛选 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">类型</label>
        <select
          v-model="filter.type"
          class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
        >
          <option value="">
            全部
          </option>
          <option value="expense">
            支出
          </option>
          <option value="income">
            收入
          </option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">分类</label>
        <select
          v-model="filter.category"
          class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
        >
          <option value="">
            全部
          </option>
          <option
            v-for="cat in ALL_CATEGORIES"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">月份</label>
        <input
          v-model="filter.month"
          type="month"
          class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
        >
      </div>
      <button
        class="px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition"
        @click="clearFilter"
      >
        重置
      </button>
    </div>

    <LoadingScreen v-if="transactionStore.loading" />

    <template v-else>
      <div
        v-if="filteredTransactions.length > 0"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div
            v-for="tx in filteredTransactions"
            :key="tx.id"
            class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                :style="{ backgroundColor: getCategoryById(tx.category).color + '20' }"
              >
                {{ getCategoryById(tx.category).icon }}
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ getCategoryById(tx.category).name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(tx.date) }} {{ tx.note }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span
                :class="tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                class="font-bold"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </span>
              <div class="flex items-center gap-1">
                <button
                  class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  @click="openEdit(tx)"
                >
                  ✏️
                </button>
                <button
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  @click="confirmDelete(tx)"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmptyState
        v-else
        icon="📋"
        title="没有找到账单"
        subtitle="尝试调整筛选条件或新增一笔"
      />
    </template>

    <TransactionModal
      v-if="showModal"
      :transaction="editingTransaction"
      @close="showModal = false"
      @saved="onSaved"
    />

    <ConfirmModal
      v-if="showConfirm"
      title="删除账单"
      message="确认删除这条账单记录吗？删除后无法恢复。"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactions'
import { getCategoryById, ALL_CATEGORIES } from '@/constants/categories'
import { formatCurrency, formatDate } from '@/utils/format'
import TransactionModal from '@/components/TransactionModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import EmptyState from '@/components/EmptyState.vue'

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchTransactions()
})

const currentMonth = new Date().toISOString().slice(0, 7)
const filter = reactive({
  type: '',
  category: '',
  month: currentMonth
})

const filteredTransactions = computed(() => {
  return transactionStore.transactions.filter(tx => {
    if (filter.type && tx.type !== filter.type) return false
    if (filter.category && tx.category !== filter.category) return false
    if (filter.month && !tx.date.startsWith(filter.month)) return false
    return true
  })
})

function clearFilter() {
  filter.type = ''
  filter.category = ''
  filter.month = currentMonth
}

const showModal = ref(false)
const editingTransaction = ref(null)

function openAdd() {
  editingTransaction.value = null
  showModal.value = true
}

function openEdit(tx) {
  editingTransaction.value = tx
  showModal.value = true
}

function onSaved() {
  transactionStore.fetchTransactions()
}

const showConfirm = ref(false)
const deletingTransaction = ref(null)

function confirmDelete(tx) {
  deletingTransaction.value = tx
  showConfirm.value = true
}

async function handleDelete() {
  if (!deletingTransaction.value) return
  try {
    await transactionStore.deleteTransaction(deletingTransaction.value.id)
  } catch (err) {
    alert('删除失败：' + err.message)
  } finally {
    showConfirm.value = false
    deletingTransaction.value = null
  }
}
</script>
