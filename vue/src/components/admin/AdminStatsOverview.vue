<template>
    <section class="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="card in displayCards" :key="card.id"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 md:p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <p class="text-xs font-medium text-slate-500">
                        {{ card.label }}
                    </p>
                    <p class="mt-1 text-2xl font-semibold text-slate-900">
                        {{ card.value }}
                    </p>
                </div>
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100">
                    <component :is="card.icon" class="w-5 h-5 text-slate-500" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">
                    {{ card.helper }}
                </span>
                <span v-if="card.trend && card.trendValue !== undefined"
                    class="inline-flex items-center text-xs font-medium" :class="card.trend === 'up'
                        ? 'text-emerald-600'
                        : card.trend === 'down'
                            ? 'text-rose-600'
                            : 'text-slate-500'">
                    <span class="mr-1">
                        {{ card.trend === 'up' ? '▲' : card.trend === 'down' ? '▼' : '•' }}
                    </span>
                    {{ card.trendValue }}%
                </span>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    CubeIcon
} from '@heroicons/vue/24/outline'

type Trend = 'up' | 'down' | 'neutral'

interface StatsCard {
    id: string
    label: string
    value: string | number
    helper?: string
    trend?: Trend
    trendValue?: number
    icon?: any
}

const props = defineProps<{
    cards?: StatsCard[]
}>()

const defaultCards: StatsCard[] = [
    {
        id: 'revenue',
        label: 'Pendapatan Hari Ini',
        value: 'Rp 3,2jt',
        helper: 'vs kemarin',
        trend: 'up',
        trendValue: 12,
        icon: CurrencyDollarIcon
    },
    {
        id: 'orders',
        label: 'Total Order',
        value: 28,
        helper: '24 jam terakhir',
        trend: 'up',
        trendValue: 8,
        icon: ShoppingBagIcon
    },
    {
        id: 'customers',
        label: 'Pelanggan Aktif',
        value: 145,
        helper: 'bulan ini',
        trend: 'neutral',
        trendValue: 0,
        icon: UserGroupIcon
    },
    {
        id: 'items',
        label: 'Barang Tersedia',
        value: 86,
        helper: '5 stok rendah',
        trend: 'down',
        trendValue: 3,
        icon: CubeIcon
    }
]

const displayCards = computed(() => props.cards?.length ? props.cards : defaultCards)
</script>
