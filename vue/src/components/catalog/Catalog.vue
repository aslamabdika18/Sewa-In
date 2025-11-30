<template>
  <section id="catalog" class="py-20 bg-linear-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-10 md:mb-14">
        <div
          class="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-bold tracking-wide"
        >
          KATALOG BARANG SEWA
        </div>
        <h2 class="text-3xl md:text-4xl font-black mb-3">
          Temukan
          <span class="bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Peralatan Terbaik
          </span>
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Pilih peralatan berdasarkan kategori, cek stok, dan lihat harga sewa per hari. Semua data langsung dari
          database.
        </p>
      </div>

      <!-- Filter & Search -->
      <div
        class="mb-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5"
      >
        <!-- Search -->
        <div class="flex-1 relative">
          <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari barang (mis. tenda, carrier, kompor)..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
            @input="onSearch"
          />
        </div>

        <!-- Category -->
        <div class="w-full md:w-64">
          <div class="relative">
            <select
              v-model="selectedCategoryId"
              class="w-full appearance-none pl-3 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              @change="onCategoryChange"
            >
              <option :value="null">Semua Kategori</option>
              <option
                v-for="cat in categoryStore.items"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="barangStore.loading"
        class="flex flex-col items-center justify-center py-16 text-gray-500"
      >
        <svg
          class="w-10 h-10 animate-spin mb-4 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            class="opacity-25"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v4m0 8v4m8-8h-4M8 12H4m13.657-5.657l-2.828 2.828M8.343 15.657l-2.828 2.828m0-11.314l2.828 2.828m8.486 8.486l2.828 2.828"
          />
        </svg>
        <p class="text-sm md:text-base">Memuat barang...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="barangStore.error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 flex flex-col items-center text-center gap-3"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 100 18 9 9 0 000-18z"
            />
          </svg>
          <h3 class="font-semibold">Terjadi kesalahan</h3>
        </div>
        <p class="text-sm md:text-base">
          {{ barangStore.error }}
        </p>
        <button
          type="button"
          class="mt-1 inline-flex items-center px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 transition"
          @click="loadData"
        >
          Coba lagi
        </button>
      </div>

      <!-- Barang Grid -->
      <div
        v-else-if="barangStore.items.length > 0"
        class="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <article
          v-for="barang in barangStore.items"
          :key="barang.id"
          class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
          @click="goToDetail(barang.id)"
        >
          <!-- Image -->
          <div class="relative w-full h-48 bg-gray-100 overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200?text=Barang"
              :alt="barang.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-if="barang.stock === 0"
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-600 text-white shadow"
            >
              Habis
            </div>
            <div
              v-else
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow"
            >
              Tersedia: {{ barang.stock }}
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 flex flex-col p-4 md:p-5">
            <div class="flex items-center justify-between gap-2 mb-2">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {{ barang.category?.name ?? 'Tanpa Kategori' }}
              </p>
            </div>

            <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
              {{ barang.name }}
            </h3>

            <p class="text-xs md:text-sm text-gray-500 mb-4 line-clamp-2">
              {{ barang.description ?? 'Tidak ada deskripsi' }}
            </p>

            <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div class="text-base md:text-lg font-black text-emerald-600">
                  Rp{{ formatPrice(barang.pricePerDay) }}
                </div>
                <div class="text-[11px] text-gray-500">/hari</div>
              </div>
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white group-hover:bg-emerald-700 group-hover:scale-110 transition-all"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300 mt-6"
      >
        <div
          class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"
        >
          <svg
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2">Belum Ada Barang</h3>
        <p class="text-sm md:text-base text-gray-500 max-w-md">
          Saat ini belum ada barang yang tersedia di katalog kami. Silakan cek kembali nanti atau hubungi admin untuk
          menambahkan barang.
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="barangStore.pagination && barangStore.pagination.totalPages > 1"
        class="mt-10 flex items-center justify-center gap-4 md:gap-6"
      >
        <button
          type="button"
          class="inline-flex items-center px-3 md:px-4 py-2 rounded-xl border text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          :disabled="barangStore.pagination.page === 1"
          @click="previousPage"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Sebelumnya
        </button>

        <span class="text-xs md:text-sm text-gray-600">
          Halaman
          <span class="font-semibold text-gray-900">{{ barangStore.pagination.page }}</span>
          dari
          <span class="font-semibold text-gray-900">{{ barangStore.pagination.totalPages }}</span>
        </span>

        <button
          type="button"
          class="inline-flex items-center px-3 md:px-4 py-2 rounded-xl border text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          :disabled="barangStore.pagination.page === barangStore.pagination.totalPages"
          @click="nextPage"
        >
          Selanjutnya
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBarangStore } from '@/stores/barang'
import { useCategoryStore } from '@/stores/category'

const router = useRouter()
const barangStore = useBarangStore()
const categoryStore = useCategoryStore()

const searchQuery = ref<string>('')
const selectedCategoryId = ref<number | null>(null)
const currentPage = ref<number>(1)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const loadData = async () => {
  await barangStore.loadBarangList({
    page: currentPage.value,
    limit: 12,
    search: searchQuery.value || undefined,
    categoryId: selectedCategoryId.value || undefined
  })
}

const loadCategories = async () => {
  if (categoryStore.items.length === 0) {
    await categoryStore.loadCategoryList({ limit: 'all' })
  }
}

const onSearch = async () => {
  currentPage.value = 1
  await loadData()
}

const onCategoryChange = async () => {
  currentPage.value = 1
  await loadData()
}

const nextPage = async () => {
  if (barangStore.pagination && currentPage.value < barangStore.pagination.totalPages) {
    currentPage.value++
    await loadData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await loadData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToDetail = (barangId: number) => {
  router.push({ name: 'BarangDetail', params: { id: barangId } })
}

onMounted(async () => {
  await loadCategories()
  await loadData()
})
</script>
