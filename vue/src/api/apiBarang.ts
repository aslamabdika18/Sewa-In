// src/api/barangApi.ts
import apiClient from '@/services/apiClient'

export interface Barang {
    id: number
    name: string
    description: string | null
    pricePerDay: number
    stock: number
    categoryId: number
    category?: {
        id: number
        name: string
    }
}

export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    pagination?: Pagination | null
}

// Ambil list barang dari Express
export async function fetchBarangList(params?: {
    page?: number
    limit?: number | 'all'
    search?: string
    categoryId?: number
}) {
    const response = await apiClient.get<ApiResponse<Barang[]>>('/barang', {
        params,
    })

    return {
        items: response.data.data,
        pagination: response.data.pagination ?? null,
    }
}

// Ambil 1 barang (kalau nanti butuh detail)
export async function fetchBarangById(id: number) {
    const response = await apiClient.get<ApiResponse<Barang>>(`/barang/${id}`)
    return response.data.data
}
