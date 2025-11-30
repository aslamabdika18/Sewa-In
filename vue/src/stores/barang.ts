import { defineStore } from 'pinia'
import { fetchBarangList, fetchBarangById, type Barang } from '@/api/apiBarang'

export interface BarangState {
  items: Barang[]
  selectedBarang: Barang | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
}

export const useBarangStore = defineStore('barang', {
  state: (): BarangState => ({
    items: [],
    selectedBarang: null,
    loading: false,
    error: null,
    pagination: null,
  }),

  getters: {
    getBarangById: (state) => (id: number) => {
      return state.items.find((b) => b.id === id)
    },
  },

  actions: {
    async loadBarangList(params?: {
      page?: number
      limit?: number | 'all'
      search?: string
      categoryId?: number
    }) {
      this.loading = true
      this.error = null

      try {
        const data = await fetchBarangList(params)
        this.items = data.items
        this.pagination = data.pagination ?? null
      } catch (err: any) {
        this.error = err.response?.data?.message ?? 'Gagal memuat data barang'
        throw err
      } finally {
        this.loading = false
      }
    },

    async loadBarangDetail(id: number) {
      this.loading = true
      this.error = null

      try {
        const data = await fetchBarangById(id)
        this.selectedBarang = data
      } catch (err: any) {
        this.error = err.response?.data?.message ?? 'Gagal memuat detail barang'
        throw err
      } finally {
        this.loading = false
      }
    },

    clearSelectedBarang() {
      this.selectedBarang = null
    },
  },
})
