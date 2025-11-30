<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Secure Header -->
        <header class="bg-white border-b border-gray-100 py-3 px-4">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <LockClosedIcon class="w-4 h-4 text-emerald-500" />
                    <span class="text-xs md:text-sm font-medium text-gray-700">
                        Checkout Aman
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <button type="button"
                        class="text-xs md:text-sm font-medium text-gray-600 hover:text-emerald-600 flex items-center gap-1">
                        <QuestionMarkCircleIcon class="w-4 h-4" />
                        Bantuan
                    </button>
                    <div class="hidden md:flex items-center gap-1 text-xs text-gray-500">
                        <PhoneIcon class="w-4 h-4" />
                        <span>Support 24/7: +62 812 3456 7890</span>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-8 lg:py-10">
            <!-- Progress Steps -->
            <CheckoutProgress :current-step="currentStep" />

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Left column -->
                <section class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-2xl shadow-lg border border-emerald-50 p-6 md:p-7">
                        <h2 class="text-lg md:text-xl font-semibold text-gray-900 mb-6">
                            Detail Penyewaan
                        </h2>

                        <!-- Item Preview -->
                        <div class="flex items-start gap-4 mb-8">
                            <div class="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden">
                                <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    {{ product.name }}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    Owner: {{ ownerName }}
                                </p>
                                <div class="flex items-center mt-1">
                                    <div class="flex text-amber-400">
                                        <StarIcon v-for="n in 4" :key="n" class="w-4 h-4" />
                                        <StarIcon class="w-4 h-4 text-gray-300" />
                                    </div>
                                    <span class="text-xs md:text-sm text-gray-500 ml-1">
                                        {{ rating }} ({{ reviews }} ulasan)
                                    </span>
                                </div>
                                <p class="text-emerald-600 font-semibold text-sm md:text-base mt-2">
                                    Rp {{ formatNumber(product.pricePerDay) }} / hari
                                </p>
                            </div>
                        </div>

                        <!-- Rental Period -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-800 mb-2">Periode Sewa</h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Mulai
                                    </label>
                                    <div class="relative">
                                        <input v-model="rental.startDate" type="text" placeholder="Pilih tanggal"
                                            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                        <CalendarDaysIcon class="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Selesai
                                    </label>
                                    <div class="relative">
                                        <input v-model="rental.endDate" type="text" placeholder="Pilih tanggal"
                                            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                        <CalendarDaysIcon class="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3 flex items-center text-xs md:text-sm text-gray-500">
                                <ClockIcon class="w-4 h-4 mr-1" />
                                <span>
                                    Durasi:
                                    <span class="font-medium text-gray-800">
                                        {{ rental.days }} hari
                                    </span>
                                    ({{ rental.startDate }} - {{ rental.endDate }})
                                </span>
                            </div>
                        </div>

                        <!-- Delivery Method -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-800 mb-2">Metode Pengambilan</h3>
                            <div class="space-y-3">
                                <label
                                    class="flex items-start p-4 border rounded-xl cursor-pointer transition hover:border-emerald-400"
                                    :class="rental.deliveryMethod === 'pickup'
                                            ? 'border-emerald-500 bg-emerald-50/40'
                                            : 'border-gray-200 bg-white'
                                        ">
                                    <input v-model="rental.deliveryMethod" type="radio" value="pickup"
                                        class="mt-1 text-emerald-600 focus:ring-emerald-500" />
                                    <div class="ml-3">
                                        <span class="block font-medium text-sm md:text-base">
                                            Ambil di Toko (Gratis)
                                        </span>
                                        <div class="flex items-center text-xs md:text-sm text-gray-500 mt-1">
                                            <MapPinIcon class="w-4 h-4 mr-1" />
                                            <span>Jl. Sudirman No. 123, Jakarta</span>
                                        </div>
                                        <div class="flex items-center text-xs md:text-sm text-gray-500 mt-1">
                                            <ClockIcon class="w-4 h-4 mr-1" />
                                            <span>Senin–Jumat: 09.00 - 18.00</span>
                                        </div>
                                    </div>
                                </label>

                                <label
                                    class="flex items-start p-4 border rounded-xl cursor-pointer transition hover:border-emerald-400"
                                    :class="rental.deliveryMethod === 'delivery'
                                            ? 'border-emerald-500 bg-emerald-50/40'
                                            : 'border-gray-200 bg-white'
                                        ">
                                    <input v-model="rental.deliveryMethod" type="radio" value="delivery"
                                        class="mt-1 text-emerald-600 focus:ring-emerald-500" />
                                    <div class="ml-3 w-full">
                                        <div class="flex items-center justify-between">
                                            <span class="block font-medium text-sm md:text-base">
                                                Diantar ke Alamat (+Rp {{ formatNumber(50000) }})
                                            </span>
                                            <span class="text-xs md:text-sm font-semibold text-gray-800">
                                                Rp {{ formatNumber(50000) }}
                                            </span>
                                        </div>
                                        <div class="mt-2">
                                            <input v-model="rental.deliveryAddress" type="text"
                                                placeholder="Masukkan alamat lengkap"
                                                class="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                        </div>
                                        <div class="flex items-center text-xs md:text-sm text-gray-500 mt-2">
                                            <ClockIcon class="w-4 h-4 mr-1" />
                                            <span>Estimasi pengantaran 1–2 jam</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Quantity -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-800 mb-2">Jumlah Unit</h3>
                            <div class="flex items-center">
                                <button type="button"
                                    class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-xl bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    @click="decreaseQty">
                                    <MinusSmallIcon class="w-4 h-4" />
                                </button>
                                <div
                                    class="w-16 h-10 flex items-center justify-center border-y border-gray-300 bg-white text-sm font-semibold">
                                    {{ quantity }}
                                </div>
                                <button type="button"
                                    class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-xl bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    @click="increaseQty">
                                    <PlusSmallIcon class="w-4 h-4" />
                                </button>
                                <span class="ml-4 text-xs md:text-sm text-gray-500">
                                    Tersedia: {{ availableStock }} unit
                                </span>
                            </div>
                        </div>

                        <!-- Add-ons -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-800 mb-2">Add-ons (Opsional)</h3>
                            <div class="space-y-2.5">
                                <label v-for="addon in addOns" :key="addon.id"
                                    class="flex items-center p-3 border rounded-xl cursor-pointer transition hover:border-emerald-400"
                                    :class="addon.selected ? 'border-emerald-500 bg-emerald-50/40' : 'border-gray-200 bg-white'">
                                    <input v-model="addon.selected" type="checkbox"
                                        class="rounded text-emerald-600 focus:ring-emerald-500" />
                                    <div class="ml-3 flex-1">
                                        <div class="flex items-center justify-between gap-2">
                                            <span class="text-sm font-medium text-gray-900">
                                                {{ addon.name }}
                                            </span>
                                            <span class="text-xs md:text-sm font-semibold text-gray-800">
                                                +Rp {{ formatNumber(addon.pricePerDay) }}/hari
                                            </span>
                                        </div>
                                        <p class="text-xs md:text-sm text-gray-500 mt-1">
                                            {{ addon.description }}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-800 mb-2">Catatan untuk Owner (Opsional)</h3>
                            <textarea v-model="notes"
                                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-24"
                                placeholder="Tulis permintaan khusus atau informasi tambahan" maxlength="200" />
                            <p class="mt-1 text-[11px] text-gray-500">
                                Maksimal 200 karakter — {{ 200 - notes.length }} karakter tersisa
                            </p>
                        </div>

                        <!-- Navigation -->
                        <div class="flex justify-between items-center pt-5 border-t border-gray-100">
                            <button type="button"
                                class="px-4 md:px-6 py-2 rounded-xl border border-gray-300 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50"
                                @click="goBackToItem">
                                Kembali ke Detail Barang
                            </button>
                            <button type="button"
                                class="hidden lg:inline-flex items-center px-5 md:px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs md:text-sm font-semibold hover:bg-emerald-700 shadow-sm"
                                @click="goNext">
                                Lanjut ke Data Penyewa
                                <ArrowRightIcon class="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>

                    <!-- Trust badges bawah form -->
                    <TrustBadges />
                </section>

                <!-- Right column -->
                <OrderSummary :product="product" :days="rental.days" :quantity="quantity" :add-ons-total="addOnsTotal"
                    :service-fee="serviceFee" :insurance="insurance" :discount="discount" :deposit="deposit"
                    @next-step="goNext" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CheckoutProgress from '@/components/checkout/CheckoutProgress.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import TrustBadges from '@/components/checkout/TrustBadges.vue'

import {
    LockClosedIcon,
    QuestionMarkCircleIcon,
    PhoneIcon,
    CalendarDaysIcon,
    MapPinIcon,
    ClockIcon,
    MinusSmallIcon,
    PlusSmallIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

interface Product {
    name: string
    imageUrl: string
    pricePerDay: number
}

interface RentalState {
    startDate: string
    endDate: string
    days: number
    deliveryMethod: 'pickup' | 'delivery'
    deliveryAddress: string
}

interface AddOn {
    id: number
    name: string
    description: string
    pricePerDay: number
    selected: boolean
}

const router = useRouter()

const currentStep = ref<number>(1)

const product = ref<Product>({
    name: 'Sony A7 III Mirrorless Camera',
    imageUrl: 'https://static.photos/technology/320x240/42',
    pricePerDay: 150_000
})

const ownerName = ref('Budi Santoso')
const rating = ref('4.8')
const reviews = ref(127)

const rental = ref<RentalState>({
    startDate: '25 Okt 2025',
    endDate: '28 Okt 2025',
    days: 3,
    deliveryMethod: 'pickup',
    deliveryAddress: ''
})

const availableStock = ref<number>(2)
const quantity = ref<number>(1)

const addOns = ref<AddOn[]>([
    {
        id: 1,
        name: 'Extra Battery',
        description: 'Baterai tambahan untuk pemakaian lebih lama',
        pricePerDay: 25_000,
        selected: false
    },
    {
        id: 2,
        name: 'SD Card 64GB',
        description: 'Kartu memori kecepatan tinggi untuk rekaman 4K',
        pricePerDay: 15_000,
        selected: false
    },
    {
        id: 3,
        name: 'Tripod',
        description: 'Tripod profesional untuk gambar stabil',
        pricePerDay: 20_000,
        selected: false
    }
])

const notes = ref<string>('')

// Biaya lainnya (sementara hard-coded, nanti bisa dari API)
const serviceFee = ref<number>(45_000)
const insurance = ref<number>(22_500)
const discount = ref<number>(0)
const deposit = ref<number>(500_000)

const addOnsTotal = computed(() => {
    return (
        addOns.value
            .filter(a => a.selected)
            .reduce((sum, a) => sum + a.pricePerDay * rental.value.days * quantity.value, 0) || 0
    )
})

const formatNumber = (val: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val)

const increaseQty = () => {
    if (quantity.value < availableStock.value) {
        quantity.value += 1
    }
}

const decreaseQty = () => {
    if (quantity.value > 1) {
        quantity.value -= 1
    }
}

const goBackToItem = () => {
    // sesuaikan dengan nama route detail barang kamu
    router.push({ name: 'BarangDetail', params: { id: 1 } })
}

const goNext = () => {
    // nanti bisa diarahkan ke step 2 (Data Penyewa)
    currentStep.value = 2
    // contoh: router.push({ name: 'CheckoutUserInfo' })
}
</script>
