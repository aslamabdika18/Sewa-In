<template>
  <section class="bg-white rounded-2xl border border-slate-200 shadow-sm">
    <header class="px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-slate-200">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Order Terbaru
          </h2>
          <p class="text-xs text-slate-500">
            Ringkasan transaksi sewa terbaru
          </p>
        </div>

        <div class="flex items-center gap-2">
          <select v-model="selectedStatusFilter"
            class="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <option value="all">Semua status</option>
            <option v-for="s in statusOptions" :key="s.value" :value="s.value">
              {{ s.label }}
            </option>
          </select>
          <button type="button"
            class="text-xs inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700">
            Lihat semua
          </button>
        </div>
      </div>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr class="text-left text-[11px] font-semibold text-slate-500 uppercase">
            <th class="px-4 md:px-5 py-3">Invoice</th>
            <th class="px-4 md:px-5 py-3">Pelanggan</th>
            <th class="px-4 md:px-5 py-3">Tanggal</th>
            <th class="px-4 md:px-5 py-3 text-right">Total</th>
            <th class="px-4 md:px-5 py-3">Status</th>
            <th class="px-4 md:px-5 py-3">Channel</th>
            <th class="px-4 md:px-5 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id"
            class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
            <td class="px-4 md:px-5 py-3 font-mono text-[11px] text-slate-700">
              {{ order.invoiceNumber }}
            </td>
            <td class="px-4 md:px-5 py-3 text-slate-800">
              {{ order.customerName }}
            </td>
            <td class="px-4 md:px-5 py-3 text-slate-600">
              {{ order.date }}
            </td>
            <td class="px-4 md:px-5 py-3 text-right font-semibold text-slate-900">
              {{ formatCurrency(order.total) }}
            </td>
            <td class="px-4 md:px-5 py-3">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                :class="statusBadgeClass(order.status)">
                {{ statusLabel(order.status) }}
              </span>
            </td>
            <td class="px-4 md:px-5 py-3 text-slate-600">
              {{ order.channel || 'Website' }}
            </td>
            <td class="px-4 md:px-5 py-3 text-right">
              <button type="button"
                class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50">
                Detail
              </button>
            </td>
          </tr>

          <tr v-if="!filteredOrders.length">
            <td colspan="7" class="px-4 md:px-5 py-6 text-center text-xs text-slate-500">
              Belum ada order dengan filter ini.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface Order {
  id: string | number
  invoiceNumber: string
  customerName: string
  date: string
  total: number
  status: OrderStatus
  channel?: string
}

const props = defineProps<{
  orders?: Order[]
}>()

const sampleOrders: Order[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2025-0012',
    customerName: 'Budi Santoso',
    date: '21 Nov 2025',
    total: 250000,
    status: 'pending',
    channel: 'Website'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2025-0011',
    customerName: 'Asrinah',
    date: '21 Nov 2025',
    total: 430000,
    status: 'confirmed',
    channel: 'WhatsApp'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2025-0010',
    customerName: 'Komunitas Hiking Aceh',
    date: '20 Nov 2025',
    total: 1200000,
    status: 'completed',
    channel: 'Website'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2025-0009',
    customerName: 'Rizki Maulana',
    date: '20 Nov 2025',
    total: 180000,
    status: 'cancelled',
    channel: 'Tokopedia'
  }
]

const displayOrders = computed<Order[]>(() =>
  props.orders?.length ? props.orders : sampleOrders
)

const statusOptions = [
  { value: 'pending', label: 'Menunggu Pembayaran' },
  { value: 'confirmed', label: 'Terkonfirmasi' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' }
] as const

const selectedStatusFilter = ref<'all' | OrderStatus>('all')

const filteredOrders = computed(() => {
  if (selectedStatusFilter.value === 'all') return displayOrders.value
  return displayOrders.value.filter(
    (order) => order.status === selectedStatusFilter.value
  )
})

const statusLabel = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'Menunggu Pembayaran'
    case 'confirmed':
      return 'Terkonfirmasi'
    case 'completed':
      return 'Selesai'
    case 'cancelled':
      return 'Dibatalkan'
  }
}

const statusBadgeClass = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-100'
    case 'confirmed':
      return 'bg-sky-50 text-sky-700 border border-sky-100'
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border border-rose-100'
  }
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
</script>
