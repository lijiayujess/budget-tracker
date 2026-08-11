<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        首页
      </h1>
      <router-link
        to="/transactions"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
      >
        + 记一笔
      </router-link>
    </div>

    <LoadingScreen v-if="transactionStore.loading" />

    <template v-else>
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="本月收入"
          :value="monthIncome"
          icon="💰"
          type="income"
        />
        <StatCard
          title="本月支出"
          :value="monthExpense"
          icon="💸"
          type="expense"
        />
        <StatCard
          title="本月结余"
          :value="monthBalance"
          icon="💎"
          :type="monthBalance >= 0 ? 'income' : 'expense'"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 支出分类饼图 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            支出分类
          </h2>
          <div
            v-if="expenseByCategory.length > 0"
            class="h-64"
          >
            <Pie
              :data="pieData"
              :options="pieOptions"
            />
          </div>
          <EmptyState
            v-else
            icon="🥧"
            title="本月暂无支出"
          />
        </div>

        <!-- 最近账单 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              最近账单
            </h2>
            <router-link
              to="/transactions"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              查看全部
            </router-link>
          </div>

          <div
            v-if="recentTransactions.length > 0"
            class="space-y-3"
          >
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  :style="{ backgroundColor: getCategoryById(tx.category).color + '20' }"
                >
                  {{ getCategoryById(tx.category).icon }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ getCategoryById(tx.category).name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(tx.date) }} {{ tx.note }}
                  </p>
                </div>
              </div>
              <span
                :class="tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                class="font-semibold"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </span>
            </div>
          </div>
          <EmptyState
            v-else
            icon="📝"
            title="暂无账单"
            subtitle="去记一笔吧"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useTransactionStore } from '@/stores/transactions'
import { getCategoryById } from '@/constants/categories'
import { formatCurrency, formatDate, getCurrentMonthRange } from '@/utils/format'
import StatCard from '@/components/StatCard.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import EmptyState from '@/components/EmptyState.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchTransactions()
})

const { start, end } = getCurrentMonthRange()

const monthTransactions = computed(() => {
  return transactionStore.transactions.filter(t => t.date >= start && t.date <= end)
})

const monthIncome = computed(() => {
  return monthTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthExpense = computed(() => {
  return monthTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthBalance = computed(() => monthIncome.value - monthExpense.value)

const expenseByCategory = computed(() => {
  const map = {}
  monthTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map)
    .map(([id, amount]) => ({
      id,
      amount,
      ...getCategoryById(id)
    }))
    .filter(item => item.amount > 0)
})

const pieData = computed(() => ({
  labels: expenseByCategory.value.map(c => c.name),
  datasets: [{
    data: expenseByCategory.value.map(c => c.amount),
    backgroundColor: expenseByCategory.value.map(c => c.color),
    borderWidth: 0
  }]
}))

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        color: 'currentColor'
      }
    }
  }
}

const recentTransactions = computed(() => {
  return transactionStore.transactions.slice(0, 5)
})
</script>
