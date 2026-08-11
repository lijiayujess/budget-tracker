import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/categories'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const incomeCategories = computed(() => INCOME_CATEGORIES)
  const expenseCategories = computed(() => EXPENSE_CATEGORIES)

  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (err) throw err
      transactions.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(transaction) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error: err } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single()

    if (err) throw err
    transactions.value.unshift(data)
    return data
  }

  async function updateTransaction(id, updates) {
    const { data, error: err } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) transactions.value[index] = data
    return data
  }

  async function deleteTransaction(id) {
    const { error: err } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (err) throw err
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return {
    transactions,
    loading,
    error,
    incomeCategories,
    expenseCategories,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
})
