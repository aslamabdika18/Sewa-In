<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden product-card hover:-translate-y-2 transition-all duration-300 flex flex-col sm:flex-row">
    <!-- Product Image -->
    <div class="sm:w-56 h-48 sm:h-auto relative flex-shrink-0 bg-gray-100">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      
      <!-- Wishlist Button -->
      <button
        @click.prevent="$emit('toggleWishlist', product.id)"
        class="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
      >
        <svg
          :class="isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
    
    <!-- Product Details -->
    <div class="flex-1 p-4 sm:p-5">
      <div class="flex flex-col h-full">
        <div class="flex-1">
          <!-- Badges & Rating -->
          <div class="flex items-start justify-between mb-2">
            <div class="flex flex-wrap gap-1">
              <span
                v-if="product.tags.includes('new')"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
              >
                Baru
              </span>
              <span
                v-if="product.tags.includes('popular')"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800"
              >
                Populer
              </span>
            </div>
            
            <div class="flex items-center">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="i <= Math.round(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span class="text-xs text-gray-500 ml-1.5">
                {{ product.rating }} ({{ product.reviews }})
              </span>
            </div>
          </div>
          
          <!-- Name & Brand -->
          <h3 class="font-semibold text-gray-900 mb-1 text-lg">
            {{ product.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-3">
            {{ product.brand }} | {{ getConditionLabel(product.condition) }}
          </p>
          
          <!-- Specs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
            <div v-if="product.specs.capacity">
              <span class="font-medium block text-xs text-gray-500">Kapasitas</span>
              <span>{{ product.specs.capacity }}</span>
            </div>
            <div v-if="product.specs.weight">
              <span class="font-medium block text-xs text-gray-500">Berat</span>
              <span>{{ product.specs.weight }}</span>
            </div>
            <div>
              <span class="font-medium block text-xs text-gray-500">Tahun</span>
              <span>{{ product.specs.year }}</span>
            </div>
          </div>
          
          <!-- Availability -->
          <div class="flex flex-wrap gap-4 text-sm mb-4">
            <div class="flex items-center text-green-600">
              <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tersedia besok</span>
            </div>
            <div v-if="product.delivery" class="flex items-center text-green-600">
              <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>Antar-jemput gratis</span>
            </div>
          </div>
        </div>
        
        <!-- Price & CTA -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-3 border-t border-gray-100">
          <div>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ formatPrice }}
            </p>
            <p
              v-if="rentalDuration !== 'daily'"
              class="text-sm text-gray-500 line-through"
            >
              Rp{{ product.price.toLocaleString('id-ID') }}/hari
            </p>
          </div>
          
          <div class="flex gap-2">
            <button
              class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Lihat Detail
            </button>
            <button
              class="bg-emerald-600 text-white py-2 px-6 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
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