<template>
    <Teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto lg:hidden">
            <!-- Background overlay -->
            <Transition
                enter-active-class="transition-opacity ease-out duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity ease-in duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="modelValue"
                    class="fixed inset-0 bg-black bg-opacity-50"
                    @click="emit('update:modelValue', false)"
                ></div>
            </Transition>

            <!-- Drawer content -->
            <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="translate-y-full"
                enter-to-class="translate-y-0"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="translate-y-0"
                leave-to-class="translate-y-full"
            >
                <div
                    v-if="modelValue"
                    class="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
                >
                    <!-- Header -->
                    <div class="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 class="text-lg font-bold text-gray-900">Filter</h2>
                        <button
                            @click="emit('update:modelValue', false)"
                            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Scrollable content -->
                    <div class="overflow-y-auto flex-1 p-4 space-y-5">
                        <!-- Search -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cari Peralatan</label>
                            <div class="relative">
                                <input
                                    v-model="filters.searchQuery"
                                    type="text"
                                    placeholder="Cari produk atau merek"
                                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div>
                            <h3 class="font-medium text-gray-900 mb-3">Kategori</h3>
                            <div class="space-y-2">
                                <label
                                    v-for="category in categories"
                                    :key="category.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg -mx-2"
                                >
                                    <input
                                        v-model="filters.selectedCategories"
                                        type="checkbox"
                                        :value="category.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <span class="ml-3 text-sm text-gray-700">{{ category.label }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div>
                            <h3 class="font-medium text-gray-900 mb-3">Rentang Harga</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-xs text-gray-600">Min: Rp{{ filters.priceRange[0].toLocaleString('id-ID') }}</label>
                                    <input
                                        v-model.number="filters.priceRange[0]"
                                        type="range"
                                        min="50000"
                                        max="5000000"
                                        step="50000"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label class="text-xs text-gray-600">Max: Rp{{ filters.priceRange[1].toLocaleString('id-ID') }}</label>
                                    <input
                                        v-model.number="filters.priceRange[1]"
                                        type="range"
                                        min="50000"
                                        max="5000000"
                                        step="50000"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Rental Duration -->
                        <div>
                            <h3 class="font-medium text-gray-900 mb-3">Durasi Rental</h3>
                            <div class="space-y-2">
                                <label
                                    v-for="duration in rentalDurations"
                                    :key="duration.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg -mx-2"
                                >
                                    <input
                                        v-model="filters.rentalDuration"
                                        type="radio"
                                        :value="duration.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                    />
                                    <span class="ml-3 text-sm text-gray-700">
                                        {{ duration.label }}
                                        <span v-if="duration.discount" class="text-green-600">(Diskon {{ duration.discount }}%)</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Condition -->
                        <div>
                            <h3 class="font-medium text-gray-900 mb-3">Kondisi</h3>
                            <div class="space-y-2">
                                <label
                                    v-for="cond in conditions"
                                    :key="cond.value"
                                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg -mx-2"
                                >
                                    <input
                                        v-model="filters.condition"
                                        type="checkbox"
                                        :value="cond.value"
                                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <span class="ml-3 text-sm text-gray-700">{{ cond.label }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Availability -->
                        <div>
                            <div class="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg -mx-2">
                                <h3 class="font-medium text-gray-900">Tersedia Sekarang</h3>
                                <button
                                    @click="filters.availability = !filters.availability"
                                    :class="filters.availability ? 'bg-emerald-600' : 'bg-gray-300'"
                                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <span
                                        :class="filters.availability ? 'translate-x-6' : 'translate-x-1'"
                                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                                    ></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="bg-gray-50 p-4 flex gap-3 border-t border-gray-200">
                        <button
                            @click="emit('reset')"
                            class="flex-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2.5 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                            Reset Filter
                        </button>
                        <button
                            @click="emit('update:modelValue', false)"
                            class="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
interface Filters {
    searchQuery: string
    priceRange: [number, number]
    selectedCategories: string[]
    rentalDuration: string
    condition: string[]
    availability: boolean
}

interface Props {
    modelValue: boolean
    filters: Filters
    categories: Array<{ value: string; label: string }>
    rentalDurations: Array<{ value: string; label: string; discount: number | null }>
    conditions: Array<{ value: string; label: string }>
}

defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'reset': []
}>()
</script>