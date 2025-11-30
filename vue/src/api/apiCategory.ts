import apiClient from '@/services/apiClient'

export interface Category {
  id: number
  name: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
}

// Ambil list kategori
export async function fetchCategoryList(params?: {
  page?: number
  limit?: number | 'all'
  search?: string
}) {
  const response = await apiClient.get<ApiResponse<Category[]>>('/category', {
    params,
  })

  return {
    items: response.data.data,
    pagination: response.data.pagination ?? null,
  }
}

// Ambil 1 kategori
export async function fetchCategoryById(id: number) {
  const response = await apiClient.get<ApiResponse<Category>>(`/category/${id}`)
  return response.data.data
}
