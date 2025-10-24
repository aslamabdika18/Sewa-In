<template>
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm p-4 mt-6 gap-4">
        <div class="text-sm text-gray-600 order-2 sm:order-1">
            <span>
                {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalItems) }} dari
                {{ totalItems }}
            </span>
        </div>

        <div class="flex items-center gap-3 order-1 sm:order-2">
            <select 
                :value="itemsPerPage"
                @change="updateItemsPerPage"
                class="text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
                <option :value="12">12 per halaman</option>
                <option :value="24">24 per halaman</option>
                <option :value="48">48 per halaman</option>
            </select>

            <nav class="flex gap-1">
                <button 
                    v-if="currentPage > 1" 
                    @click="emit('update:currentPage', currentPage - 1)"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button 
                    v-for="page in totalPages" 
                    :key="page" 
                    @click="emit('update:currentPage', page)"
                    :class="currentPage === page ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
                    class="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium transition-colors min-w-[40px]"
                >
                    {{ page }}
                </button>

                <button 
                    v-if="currentPage < totalPages" 
                    @click="emit('update:currentPage', currentPage + 1)"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    totalItems: number
}

defineProps<Props>()

const emit = defineEmits<{
    'update:currentPage': [value: number]
    'update:itemsPerPage': [value: number]
}>()

function updateItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('update:itemsPerPage', Number(target.value))
}
</script>