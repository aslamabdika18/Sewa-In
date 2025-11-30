<template>
    <aside class="lg:col-span-1">
        <div class="sticky top-6 space-y-4">
            <!-- Card utama -->
            <div class="bg-white rounded-2xl shadow-lg border border-emerald-50 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base md:text-lg font-semibold text-gray-900">
                        Ringkasan Pesanan
                    </h2>
                </div>

                <div class="px-6 py-5 border-b border-gray-100">
                    <!-- Product mini -->
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden mr-3">
                            <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900">
                                {{ product.name }}
                            </h3>
                            <p class="text-[11px] text-gray-500">
                                {{ days }} hari sewa • x{{ quantity }}
                            </p>
                            <p class="text-sm font-semibold text-emerald-600 mt-1">
                                Rp {{ formatNumber(baseTotal) }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-2.5 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Harga dasar</span>
                            <span>Rp {{ formatNumber(baseTotal) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Add-ons</span>
                            <span>Rp {{ formatNumber(addOnsTotal) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Biaya layanan</span>
                            <span>Rp {{ formatNumber(serviceFee) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Asuransi</span>
                            <span>Rp {{ formatNumber(insurance) }}</span>
                        </div>
                        <div class="flex justify-between text-emerald-600">
                            <span>Diskon</span>
                            <span>-Rp {{ formatNumber(discount) }}</span>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-5">
                    <div class="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Subtotal</span>
                        <span class="font-semibold text-gray-900">
                            Rp {{ formatNumber(subtotal) }}
                        </span>
                    </div>
                    <div class="flex justify-between text-xs md:text-sm text-gray-500 mb-4">
                        <span>Deposit (dibayar saat ambil)</span>
                        <span>Rp {{ formatNumber(deposit) }}</span>
                    </div>

                    <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span class="text-sm font-semibold text-gray-900">Total</span>
                        <span class="text-lg md:text-xl font-black text-emerald-600">
                            Rp {{ formatNumber(grandTotal) }}
                        </span>
                    </div>

                    <!-- CTA mobile -->
                    <button type="button"
                        class="w-full mt-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm md:text-base hover:bg-emerald-700 transition lg:hidden"
                        @click="$emit('nextStep')">
                        Lanjut ke Data Penyewa
                    </button>

                    <div
                        class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-500">
                        <LockClosedIcon class="w-4 h-4" />
                        <span class="text-xs md:text-sm">Transaksi diamankan dengan SSL</span>
                    </div>
                </div>
            </div>

            <!-- Protection info -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">
                    Penyewaanmu Termasuk
                </h3>
                <ul class="space-y-3 text-xs md:text-sm text-gray-700">
                    <li class="flex items-start">
                        <ShieldCheckIcon class="w-4 h-4 text-emerald-500 mt-0.5 mr-2" />
                        <span>Perlindungan kerusakan hingga Rp 10.000.000</span>
                    </li>
                    <li class="flex items-start">
                        <ClockIcon class="w-4 h-4 text-emerald-500 mt-0.5 mr-2" />
                        <span>Dukungan pelanggan 24/7</span>
                    </li>
                    <li class="flex items-start">
                        <ArrowPathIcon class="w-4 h-4 text-emerald-500 mt-0.5 mr-2" />
                        <span>Gratis pembatalan hingga H-1</span>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    LockClosedIcon,
    ShieldCheckIcon,
    ClockIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'

interface ProductInfo {
    name: string
    imageUrl: string
    pricePerDay: number
}

const props = defineProps<{
    product: ProductInfo
    days: number
    quantity: number
    addOnsTotal: number
    serviceFee: number
    insurance: number
    discount: number
    deposit: number
}>()

defineEmits<{
    (e: 'nextStep'): void
}>()

const baseTotal = computed(() => props.product.pricePerDay * props.days * props.quantity)

const subtotal = computed(
    () => baseTotal.value + props.addOnsTotal + props.serviceFee + props.insurance - props.discount
)

const grandTotal = computed(() => subtotal.value + props.deposit)

const formatNumber = (val: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val)
</script>
