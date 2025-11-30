<template>
    <div class="space-y-4 md:space-y-6">
        <!-- INVENTORY SUMMARY -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-slate-900">
                    Ringkasan Inventaris
                </h2>
                <span class="text-[11px] text-slate-500">
                    Per hari ini
                </span>
            </div>

            <dl class="grid grid-cols-3 gap-3 text-xs">
                <div class="bg-slate-50 rounded-xl px-3 py-2.5">
                    <dt class="text-slate-500 mb-1">Total Barang</dt>
                    <dd class="text-base font-semibold text-slate-900">
                        {{ inventory.totalItems }}
                    </dd>
                </div>
                <div class="bg-slate-50 rounded-xl px-3 py-2.5">
                    <dt class="text-slate-500 mb-1">Aktif Disewa</dt>
                    <dd class="text-base font-semibold text-emerald-600">
                        {{ inventory.activeItems }}
                    </dd>
                </div>
                <div class="bg-slate-50 rounded-xl px-3 py-2.5">
                    <dt class="text-slate-500 mb-1">Stok Rendah</dt>
                    <dd class="text-base font-semibold text-rose-600">
                        {{ inventory.lowStockItems }}
                    </dd>
                </div>
            </dl>
        </section>

        <!-- TOP PRODUCTS -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-slate-900">
                    Produk Terlaris
                </h2>
                <span class="text-[11px] text-slate-500">
                    7 hari terakhir
                </span>
            </div>

            <ul class="space-y-3 text-xs">
                <li v-for="product in topProducts" :key="product.name" class="flex items-center justify-between gap-2">
                    <div class="flex flex-col">
                        <span class="font-medium text-slate-900">
                            {{ product.name }}
                        </span>
                        <span class="text-[11px] text-slate-500">
                            {{ product.category }}
                        </span>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-700">
                        {{ product.totalRentals }}x sewa
                    </span>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface InventorySummary {
    totalItems: number
    activeItems: number
    lowStockItems: number
}

interface TopProduct {
    name: string
    category: string
    totalRentals: number
}

const props = defineProps<{
    inventorySummary?: InventorySummary
    topProducts?: TopProduct[]
}>()

const defaultInventory: InventorySummary = {
    totalItems: 120,
    activeItems: 32,
    lowStockItems: 7
}

const defaultTopProducts: TopProduct[] = [
    { name: 'Tenda Dome 4P Premium', category: 'Tenda', totalRentals: 14 },
    { name: 'Carrier 60L Hiking', category: 'Tas Carrier', totalRentals: 11 },
    { name: 'Sleeping Bag Polar', category: 'Sleeping Bag', totalRentals: 9 }
]

const inventory = computed(
    () => props.inventorySummary ?? defaultInventory
)
const topProducts = computed(
    () => (props.topProducts?.length ? props.topProducts : defaultTopProducts)
)
</script>
