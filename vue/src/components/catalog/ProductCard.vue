<template>
    <div
        class="bg-white rounded-lg shadow-md overflow-hidden product-card hover:-translate-y-2 transition-all duration-300">
        <!-- Product Image -->
        <div class="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" loading="lazy" />

            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-wrap gap-1">
                <span v-if="product.tags.includes('new')"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Baru
                </span>
                <span v-if="product.tags.includes('popular')"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                    Populer
                </span>
                <span v-if="product.tags.includes('limited')"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Tersisa {{ product.stock }}
                </span>
            </div>

            <!-- Wishlist Button -->
            <button @click.prevent="$emit('toggleWishlist', product.id)"
                class="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
                <svg :class="isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'" class="w-4 h-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>

        <!-- Product Details -->
        <div class="p-4">
            <!-- Rating -->
            <div class="flex items-center mb-2">
                <div class="flex">
                    <svg v-for="i in 5" :key="i"
                        :class="i <= Math.round(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'"
                        class="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <span class="text-xs text-gray-500 ml-1.5">
                    {{ product.rating }} ({{ product.reviews }})
                </span>
            </div>

            <!-- Name & Brand -->
            <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                {{ product.name }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 mb-3">
                {{ product.brand }} | {{ getConditionLabel(product.condition) }}
            </p>

            <!-- Price -->
            <div class="mb-4">
                <p class="text-lg sm:text-xl font-bold text-gray-900">
                    {{ formatPrice }}
                </p>
                <p v-if="rentalDuration !== 'daily'" class="text-xs text-gray-500 line-through">
                    Rp{{ product.price.toLocaleString('id-ID') }}/hari
                </p>
            </div>

            <!-- Quick Specs -->
            <div class="flex flex-wrap gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <span class="inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ product.specs.year }}</span>
                </span>
                <span v-if="product.specs.capacity" class="inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{{ product.specs.capacity }}</span>
                </span>
            </div>

            <!-- Availability -->
            <div class="space-y-1 mb-4">
                <div class="flex items-center text-xs sm:text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Tersedia besok</span>
                </div>
                <div v-if="product.delivery" class="flex items-center text-xs sm:text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span>Antar-jemput gratis</span>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2">
                <button
                    class="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                    Detail
                </button>
                <button
                    class="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
                    Pesan
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Product {
    id: number
    name: string
    brand: string
    price: number
    weeklyPrice: number
    monthlyPrice: number
    rating: number
    reviews: number
    condition: string
    stock: number
    tags: string[]
    delivery: boolean
    specs: Record<string, any>
    image: string
}

interface Props {
    product: Product
    rentalDuration: string
    isWishlisted: boolean
}

const props = defineProps<Props>()

defineEmits<{
    (e: 'toggleWishlist', id: number): void
}>()

const formatPrice = computed(() => {
    let price: number
    let unit: string

    switch (props.rentalDuration) {
        case 'weekly':
            price = props.product.weeklyPrice
            unit = '/minggu'
            break
        case 'monthly':
            price = props.product.monthlyPrice
            unit = '/bulan'
            break
        default:
            price = props.product.price
            unit = '/hari'
    }

    return `Rp${price.toLocaleString('id-ID')}${unit}`
})

const getConditionLabel = (condition: string): string => {
    const labels: Record<string, string> = {
        'new': 'Baru',
        'like-new': 'Seperti Baru',
        'good': 'Baik'
    }
    return labels[condition] || condition
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>