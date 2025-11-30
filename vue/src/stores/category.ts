import { defineStore } from 'pinia'
import { fetchCategoryList, fetchCategoryById, type Category } from '@/api/apiCategory'

export interface CategoryState {
  items: Category[]
  selectedCategory: Category | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    items: [],
    selectedCategory: null,
    loading: false,
    error: null,
    pagination: null,
  }),

  getters: {
    getCategoryById: (state) => (id: number) => {
      return state.items.find((c) => c.id === id)
    },
  },

  actions: {
    async loadCategoryList(params?: {
      page?: number
      limit?: number | 'all'
      search?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const data = await fetchCategoryList(params)
        this.items = data.items
        this.pagination = data.pagination ?? null
      } catch (err: any) {
        this.error = err.response?.data?.message ?? 'Gagal memuat data kategori'
        throw err
      } finally {
        this.loading = false
      }
    },

    async loadCategoryDetail(id: number) {
      this.loading = true
      this.error = null

      try {
        const data = await fetchCategoryById(id)
        this.selectedCategory = data
      } catch (err: any) {
        this.error = err.response?.data?.message ?? 'Gagal memuat detail kategori'
        throw err
      } finally {
        this.loading = false
      }
    },

    clearSelectedCategory() {
      this.selectedCategory = null
    },
  },
})
