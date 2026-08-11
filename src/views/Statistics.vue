<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      收支统计
    </h1>

    <LoadingScreen v-if="transactionStore.loading" />

    <template v-else>
      <!-- 年度汇总 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="年度收入"
          :value="yearIncome"
          icon="📈"
          type="income"
        />
        <StatCard
          title="年度支出"
          :value="yearExpense"
          icon="📉"
          type="expense"
        />
        <StatCard
          title="年度结余"
          :value="yearBalance"
          icon="💎"
          :type="yearBalance >= 0 ? 'income' : 'expense'"
        />
      </div>

      <!-- 月度趋势图 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            月度收支趋势
          </h2>
          <select
            v-model="selectedYear"
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
          >
            <option
              v-for="year in availableYears"
              :key="year"
              :value="year"
            >
              {{ year }}年
            </option>
          </select>
        </div>
        <div
          v-if="chartData.labels.length > 0"
          class="h-80"
        >
          <Bar
            :data="chartData"
            :options="chartOptions"
          />
        </div>
        <EmptyState
          v-else
          icon="📊"
          title="该年份暂无数据"
        />
      </div>

      <!-- 支出 Top 分类 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          年度支出 Top 分类
        </h2>
        <div
          v-if="topExpenseCategories.length > 0"
          class="space-y-3"
        >
          <div
            v-for="item in topExpenseCategories"
            :key="item.id"
            class="flex items-center gap-4"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              :style="{ backgroundColor: item.color + '20' }"
            >
              {{ item.icon }}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ formatCurrency(item.amount) }}</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :style="{ width: item.percent + '%', backgroundColor: item.color }"
                />
              </div>
            </div>
          </div>
        </div>
        <EmptyState
          v-else
          icon="🏷️"
          title="暂无支出数据"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useTransactionStore } from '@/stores/transactions'
import { getCategoryById } from '@/constants/categories'
import { formatCurrency } from '@/utils/format'
import StatCard from '@/components/StatCard.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import EmptyState from '@/components/EmptyState.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchTransactions()
})

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)

const availableYears = computed(() => {
  const years = new Set(transactionStore.transactions.map(t => new Date(t.date).getFullYear()))
  const list = Array.from(years).sort((a, b) => b - a)
  if (list.length === 0) list.push(currentYear)
  return list
})

const yearTransactions = computed(() => {
  return transactionStore.transactions.filter(t => new Date(t.date).getFullYear() === selectedYear.value)
})

const yearIncome = computed(() => yearTransactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))
const yearExpense = computed(() => yearTransactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
const yearBalance = computed(() => yearIncome.value - yearExpense.value)

const monthlyData = computed(() => {
  const months = Array.from({ length: 12 }, (_, i) => `${selectedYear.value}-${String(i + 1).padStart(2, '0')}`)
  const income = new Array(12).fill(0)
  const expense = new Array(12).fill(0)

  yearTransactions.value.forEach(t => {
    const month = t.date.slice(0, 7)
    const idx = months.indexOf(month)
    if (idx !== -1) {
      if (t.type === 'income') income[idx] += t.amount
      else expense[idx] += t.amount
    }
  })

  return { labels: months.map(m => m.slice(5) + '月'), income, expense }
})

const chartData = computed(() => ({
  labels: monthlyData.value.labels,
  datasets: [
    {
      label: '收入',
      data: monthlyData.value.income,
      backgroundColor: '#10b981',
      borderRadius: 4
    },
    {
      label: '支出',
      data: monthlyData.value.expense,
      backgroundColor: '#ef4444',
      borderRadius: 4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'currentColor' }
    }
  },
  scales: {
    x: {
      ticks: { color: 'currentColor' },
      grid: { color: 'rgba(156, 163, 175, 0.2)' }
    },
    y: {
      ticks: { color: 'currentColor' },
      grid: { color: 'rgba(156, 163, 175, 0.2)' }
    }
  }
}

const topExpenseCategories = computed(() => {
  const map = {}
  yearTransactions.value.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount
  })
  const total = Object.values(map).reduce((a, b) => a + b, 0)
  return Object.entries(map)
    .map(([id, amount]) => ({
      id,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      ...getCategoryById(id)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
})
</script>
