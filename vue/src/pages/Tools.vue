<template>
    <div class="font-sans bg-gray-50 text-gray-800">
        <!-- Header Section -->
        <header class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-whitey py-6 sm:py-8 lg:py-12 ">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center text-xs sm:text-sm text-emerald-100 mb-2">
                    <RouterLink to="/" class="hover:text-white transition-colors">Beranda</RouterLink>
                    <span class="mx-2">/</span>
                    <RouterLink to="/tools" class="hover:text-white transition-colors">Peralatan</RouterLink>
                    <span class="mx-2">/</span>
                    <span class="text-white">Semua Kategori</span>
                </div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Sewa Peralatan Outdoor</h1>
                <p class="text-sm sm:text-base text-emerald-100 max-w-2xl">
                    Temukan peralatan berkualitas tinggi untuk petualangan Anda. Dengan harga kompetitif dan layanan
                    profesional, kami siap mendukung setiap perjalanan Anda.
                </p>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Filter Sidebar - Desktop -->
                <aside class="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 class="font-bold text-lg mb-4 flex items-center justify-between">
                            Filter
                            <button @click="resetFilters" class="text-xs text-emerald-600 hover:text-emerald-700">
                                Reset
                            </button>
                        </h2>

                        <!-- Search -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cari Peralatan</label>
                            <div class="relative">
                                <input v-model="filters.searchQuery" type="text" placeholder="Cari produk atau merek"
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                                <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-700 mb-3 text-sm">Kategori</h3>
                            <div class="space-y-2">
                                <label v-for="category in categories" :key="category.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded -ml-2">
                                    <input v-model="filters.selectedCategories" type="checkbox" :value="category.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                                    <span class="ml-2 text-sm text-gray-700">{{ category.label }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-700 mb-3 text-sm">Rentang Harga</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-xs text-gray-600">Min: Rp{{
                                        filters.priceRange[0].toLocaleString('id-ID') }}</label>
                                    <input v-model.number="filters.priceRange[0]" type="range" min="50000" max="5000000"
                                        step="50000"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label class="text-xs text-gray-600">Max: Rp{{
                                        filters.priceRange[1].toLocaleString('id-ID') }}</label>
                                    <input v-model.number="filters.priceRange[1]" type="range" min="50000" max="5000000"
                                        step="50000"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <!-- Rental Duration -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-700 mb-3 text-sm">Durasi Rental</h3>
                            <div class="space-y-2">
                                <label v-for="duration in rentalDurations" :key="duration.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded -ml-2">
                                    <input v-model="filters.rentalDuration" type="radio" :value="duration.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                                    <span class="ml-2 text-sm text-gray-700">
                                        {{ duration.label }}
                                        <span v-if="duration.discount" class="text-green-600">(Diskon {{
                                            duration.discount }}%)</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Condition -->
                        <div class="mb-6">
                            <h3 class="font-medium text-gray-700 mb-3 text-sm">Kondisi</h3>
                            <div class="space-y-2">
                                <label v-for="cond in conditions" :key="cond.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded -ml-2">
                                    <input v-model="filters.condition" type="checkbox" :value="cond.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                                    <span class="ml-2 text-sm text-gray-700">{{ cond.label }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Availability -->
                        <div class="mb-4">
                            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded -mx-2">
                                <h3 class="font-medium text-gray-700 text-sm">Tersedia Sekarang</h3>
                                <button @click="filters.availability = !filters.availability"
                                    :class="filters.availability ? 'bg-emerald-600' : 'bg-gray-300'"
                                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                                    <span :class="filters.availability ? 'translate-x-6' : 'translate-x-1'"
                                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content Area -->
                <div class="flex-1 min-w-0 mb-20 lg:mb-0">
                    <!-- Sorting & View Options -->
                    <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div class="w-full sm:w-auto">
                                <span class="text-sm text-gray-600">Menampilkan {{ filteredProducts.length }}
                                    produk</span>
                                <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                                    <span v-for="filter in activeFilters" :key="filter"
                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        {{ filter }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <div class="flex items-center flex-1 sm:flex-initial">
                                    <label for="sort"
                                        class="text-xs sm:text-sm text-gray-600 mr-2 whitespace-nowrap">Urutkan:</label>
                                    <select id="sort" v-model="sortBy"
                                        class="text-xs sm:text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 flex-1 sm:flex-initial">
                                        <option value="popular">Populer</option>
                                        <option value="price-low">Harga ↑</option>
                                        <option value="price-high">Harga ↓</option>
                                        <option value="rating">Rating</option>
                                        <option value="newest">Terbaru</option>
                                    </select>
                                </div>

                                <div class="hidden sm:flex items-center gap-1 border-l pl-4 border-gray-200">
                                    <button @click="viewType = 'grid'"
                                        :class="viewType === 'grid' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'"
                                        class="p-1.5 rounded hover:bg-gray-100 transition-colors">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button @click="viewType = 'list'"
                                        :class="viewType === 'list' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'"
                                        class="p-1.5 rounded hover:bg-gray-100 transition-colors">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Grid -->
                    <div v-if="viewType === 'grid'"
                        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product"
                            :rental-duration="filters.rentalDuration" :is-wishlisted="wishlist.includes(product.id)"
                            @toggle-wishlist="toggleWishlist" />
                    </div>

                    <!-- Product List View -->
                    <div v-if="viewType === 'list'" class="space-y-4">
                        <ProductListItem v-for="product in paginatedProducts" :key="product.id" :product="product"
                            :rental-duration="filters.rentalDuration" :is-wishlisted="wishlist.includes(product.id)"
                            @toggle-wishlist="toggleWishlist" />
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredProducts.length === 0"
                        class="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <div class="max-w-md mx-auto">
                            <div
                                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada produk yang sesuai</h3>
                            <p class="text-gray-500 mb-6">Coba ubah filter pencarian Anda atau gunakan kata kunci yang
                                berbeda</p>
                            <button @click="resetFilters"
                                class="bg-emerald-600 text-white py-2.5 px-6 rounded-md hover:bg-emerald-700 transition-colors font-medium">
                                Reset Semua Filter
                            </button>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <Pagination v-if="filteredProducts.length > pagination.itemsPerPage"
                        v-model:current-page="pagination.currentPage"
                        v-model:items-per-page="pagination.itemsPerPage"
                        :total-pages="totalPages"
                        :total-items="filteredProducts.length" />
                </div>
            </div>
        </main>

        <!-- Mobile Filter Button -->
        <div class="lg:hidden fixed bottom-20 right-4 z-40">
            <button @click="mobileFilterOpen = true"
                class="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </button>
        </div>

        <!-- Mobile Filter Drawer -->
        <MobileFilterDrawer 
            v-model="mobileFilterOpen" 
            :filters="filters" 
            :categories="categories"
            :rental-durations="rentalDurations" 
            :conditions="conditions" 
            @reset="resetFilters" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import ProductListItem from '@/components/catalog/ProductListItem.vue'
import Pagination from '@/components/catalog/Pagination.vue'
import MobileFilterDrawer from '@/components/catalog/MobileFilterDrawer.vue'

// Types
interface Product {
    id: number
    name: string
    brand: string
    category: string
    price: number
    weeklyPrice: number
    monthlyPrice: number
    rating: number
    reviews: number
    condition: string
    availability: boolean
    stock: number
    tags: string[]
    delivery: boolean
    specs: Record<string, any>
    image: string
}

interface Filters {
    searchQuery: string
    priceRange: [number, number]
    selectedCategories: string[]
    rentalDuration: string
    condition: string[]
    availability: boolean
}

// State
const mobileFilterOpen = ref(false)
const viewType = ref<'grid' | 'list'>('grid')
const sortBy = ref('popular')
const wishlist = ref<number[]>([])

const pagination = ref({
    currentPage: 1,
    itemsPerPage: 12
})

const filters = ref<Filters>({
    searchQuery: '',
    priceRange: [50000, 5000000],
    selectedCategories: [],
    rentalDuration: 'daily',
    condition: [],
    availability: true
})

// Data
const categories = [
    { value: 'camping', label: 'Camping & Tenda' },
    { value: 'hiking', label: 'Hiking & Trekking' },
    { value: 'carrier', label: 'Tas & Carrier' },
    { value: 'cooking', label: 'Perlengkapan Masak' },
    { value: 'lighting', label: 'Penerangan' }
]

const rentalDurations = [
    { value: 'daily', label: 'Harian', discount: null },
    { value: 'weekly', label: 'Mingguan', discount: 10 },
    { value: 'monthly', label: 'Bulanan', discount: 25 }
]

const conditions = [
    { value: 'new', label: 'Baru (< 6 bulan)' },
    { value: 'like-new', label: 'Seperti Baru' },
    { value: 'good', label: 'Baik' }
]

const products = ref<Product[]>([
    {
        id: 1,
        name: 'Tenda Dome 4 Orang Waterproof',
        brand: 'Rei',
        category: 'camping',
        price: 75000,
        weeklyPrice: 67500,
        monthlyPrice: 56250,
        rating: 4.9,
        reviews: 87,
        condition: 'like-new',
        availability: true,
        stock: 3,
        tags: ['popular'],
        delivery: true,
        specs: { capacity: '4 orang', waterproof: '3000mm', year: 2022 },
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=640&h=360&fit=crop'
    },
    {
        id: 2,
        name: 'Carrier 60L + Raincover',
        brand: 'Deuter',
        category: 'carrier',
        price: 50000,
        weeklyPrice: 45000,
        monthlyPrice: 37500,
        rating: 4.8,
        reviews: 124,
        condition: 'good',
        availability: true,
        stock: 5,
        tags: ['new'],
        delivery: true,
        specs: { capacity: '60L', weight: '2.5kg', year: 2023 },
        image: 'https://images.unsplash.com/photo-1622260614927-735d7aecdb3a?w=640&h=360&fit=crop'
    },
    {
        id: 3,
        name: 'Sleeping Bag -5°C',
        brand: 'Consina',
        category: 'camping',
        price: 40000,
        weeklyPrice: 36000,
        monthlyPrice: 30000,
        rating: 4.7,
        reviews: 95,
        condition: 'like-new',
        availability: true,
        stock: 8,
        tags: [],
        delivery: true,
        specs: { temp: '-5°C', weight: '1.2kg', year: 2022 },
        image: 'https://images.unsplash.com/photo-1520214572569-0d593dc3f1f2?w=640&h=360&fit=crop'
    },
    {
        id: 4,
        name: 'Kompor Portable + Gas',
        brand: 'Natur',
        category: 'cooking',
        price: 25000,
        weeklyPrice: 22500,
        monthlyPrice: 18750,
        rating: 4.6,
        reviews: 65,
        condition: 'good',
        availability: true,
        stock: 10,
        tags: [],
        delivery: true,
        specs: { type: 'Gas', year: 2021 },
        image: 'https://images.unsplash.com/photo-1624384648850-92b3e495eb95?w=640&h=360&fit=crop'
    },
    {
        id: 5,
        name: 'Headlamp LED 500 Lumen',
        brand: 'Petzl',
        category: 'lighting',
        price: 20000,
        weeklyPrice: 18000,
        monthlyPrice: 15000,
        rating: 4.8,
        reviews: 72,
        condition: 'new',
        availability: true,
        stock: 12,
        tags: ['new', 'popular'],
        delivery: true,
        specs: { lumens: '500', battery: '20h', year: 2023 },
        image: 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=640&h=360&fit=crop'
    },
    {
        id: 6,
        name: 'Matras Self-Inflating',
        brand: 'Naturehike',
        category: 'camping',
        price: 35000,
        weeklyPrice: 31500,
        monthlyPrice: 26250,
        rating: 4.5,
        reviews: 48,
        condition: 'like-new',
        availability: true,
        stock: 6,
        tags: [],
        delivery: true,
        specs: { thickness: '3cm', weight: '800g', year: 2022 },
        image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=640&h=360&fit=crop'
    },
    {
        id: 7,
        name: 'Sepatu Hiking Waterproof',
        brand: 'Salomon',
        category: 'hiking',
        price: 60000,
        weeklyPrice: 54000,
        monthlyPrice: 45000,
        rating: 4.9,
        reviews: 103,
        condition: 'good',
        availability: true,
        stock: 4,
        tags: ['popular'],
        delivery: true,
        specs: { size: '39-44', waterproof: 'Gore-Tex', year: 2021 },
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&h=360&fit=crop'
    },
    {
        id: 8,
        name: 'Trekking Pole Aluminium',
        brand: 'Arei',
        category: 'hiking',
        price: 15000,
        weeklyPrice: 13500,
        monthlyPrice: 11250,
        rating: 4.4,
        reviews: 56,
        condition: 'good',
        availability: true,
        stock: 15,
        tags: [],
        delivery: true,
        specs: { material: 'Aluminium', adjustable: '65-135cm', year: 2022 },
        image: 'https://images.unsplash.com/photo-1623156759722-f8fdf2e6f0f8?w=640&h=360&fit=crop'
    },
    {
        id: 9,
        name: 'Flysheet Tarp 3x3m',
        brand: 'Eiger',
        category: 'camping',
        price: 30000,
        weeklyPrice: 27000,
        monthlyPrice: 22500,
        rating: 4.6,
        reviews: 42,
        condition: 'like-new',
        availability: true,
        stock: 7,
        tags: [],
        delivery: true,
        specs: { size: '3x3m', waterproof: '2000mm', year: 2022 },
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=640&h=360&fit=crop'
    },
    {
        id: 10,
        name: 'Nesting Cookware Set',
        brand: 'Sea to Summit',
        category: 'cooking',
        price: 45000,
        weeklyPrice: 40500,
        monthlyPrice: 33750,
        rating: 4.7,
        reviews: 38,
        condition: 'new',
        availability: true,
        stock: 5,
        tags: ['new'],
        delivery: true,
        specs: { pieces: '7pcs', material: 'Aluminium', year: 2023 },
        image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=640&h=360&fit=crop'
    },
    {
        id: 11,
        name: 'Daypack 25L',
        brand: 'Osprey',
        category: 'carrier',
        price: 35000,
        weeklyPrice: 31500,
        monthlyPrice: 26250,
        rating: 4.8,
        reviews: 91,
        condition: 'like-new',
        availability: true,
        stock: 8,
        tags: ['popular'],
        delivery: true,
        specs: { capacity: '25L', weight: '600g', year: 2022 },
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=640&h=360&fit=crop'
    },
    {
        id: 12,
        name: 'Lampu Emergency Solar',
        brand: 'Luci',
        category: 'lighting',
        price: 18000,
        weeklyPrice: 16200,
        monthlyPrice: 13500,
        rating: 4.5,
        reviews: 29,
        condition: 'new',
        availability: true,
        stock: 20,
        tags: ['new'],
        delivery: true,
        specs: { power: 'Solar', lumens: '150', year: 2023 },
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=640&h=360&fit=crop'
    }
])

// Computed
const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const matchesSearch = !filters.value.searchQuery ||
            product.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(filters.value.searchQuery.toLowerCase())

        const matchesPrice = product.price >= filters.value.priceRange[0] &&
            product.price <= filters.value.priceRange[1]

        const matchesCategory = filters.value.selectedCategories.length === 0 ||
            filters.value.selectedCategories.includes(product.category)

        const matchesCondition = filters.value.condition.length === 0 ||
            filters.value.condition.includes(product.condition)

        const matchesAvailability = !filters.value.availability || product.availability

        return matchesSearch && matchesPrice && matchesCategory &&
            matchesCondition && matchesAvailability
    })
})

const sortedProducts = computed(() => {
    const filtered = [...filteredProducts.value]
    return filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'popular':
                return (b.rating * b.reviews) - (a.rating * a.reviews)
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'rating':
                return b.rating - a.rating
            case 'newest':
                return b.specs.year - a.specs.year
            default:
                return 0
        }
    })
})

const paginatedProducts = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
    const end = start + pagination.value.itemsPerPage
    return sortedProducts.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / pagination.value.itemsPerPage)
})

const activeFilters = computed(() => {
    const active: string[] = []

    if (filters.value.searchQuery) {
        active.push(`"${filters.value.searchQuery}"`)
    }

    if (filters.value.priceRange[0] > 50000 || filters.value.priceRange[1] < 5000000) {
        active.push(`Rp${(filters.value.priceRange[0] / 1000).toFixed(0)}k-${(filters.value.priceRange[1] / 1000).toFixed(0)}k`)
    }

    if (filters.value.selectedCategories.length > 0) {
        filters.value.selectedCategories.forEach(cat => {
            const category = categories.find(c => c.value === cat)
            if (category) active.push(category.label)
        })
    }

    if (filters.value.condition.length > 0) {
        filters.value.condition.forEach(cond => {
            const condition = conditions.find(c => c.value === cond)
            if (condition) active.push(condition.label)
        })
    }

    if (filters.value.rentalDuration !== 'daily') {
        const duration = rentalDurations.find(d => d.value === filters.value.rentalDuration)
        if (duration) active.push(duration.label)
    }

    return active
})

// Methods
const resetFilters = () => {
    filters.value = {
        searchQuery: '',
        priceRange: [50000, 5000000],
        selectedCategories: [],
        rentalDuration: 'daily',
        condition: [],
        availability: true
    }
    pagination.value.currentPage = 1
}

const toggleWishlist = (productId: number) => {
    const index = wishlist.value.indexOf(productId)
    if (index > -1) {
        wishlist.value.splice(index, 1)
    } else {
        wishlist.value.push(productId)
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist.value))
}

// Watchers
watch(() => filters.value, () => {
    pagination.value.currentPage = 1
}, { deep: true })

// Lifecycle
onMounted(() => {
    const savedViewType = localStorage.getItem('viewType')
    if (savedViewType) viewType.value = savedViewType as 'grid' | 'list'

    const savedSortBy = localStorage.getItem('sortBy')
    if (savedSortBy) sortBy.value = savedSortBy

    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) wishlist.value = JSON.parse(savedWishlist)
})

watch(viewType, (value) => {
    localStorage.setItem('viewType', value)
})

watch(sortBy, (value) => {
    localStorage.setItem('sortBy', value)
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #059669;
    cursor: pointer;
    border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #059669;
    cursor: pointer;
    border-radius: 50%;
    border: none;
}
</style>