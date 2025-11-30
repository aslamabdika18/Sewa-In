<template>
  <div class="barang-detail-container">
    <!-- Back Button -->
    <router-link to="/" class="back-link">&larr; Kembali ke Katalog</router-link>

    <!-- Loading State -->
    <div v-if="barangStore.loading" class="loading">
      <p>Memuat detail barang...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="barangStore.error" class="error">
      <p>{{ barangStore.error }}</p>
      <router-link to="/">Kembali ke Katalog</router-link>
    </div>

    <!-- Detail Content -->
    <div v-else-if="barangStore.selectedBarang" class="detail-content">
      <div class="detail-grid">
        <!-- Image Section -->
        <div class="image-section">
          <img
            src="https://via.placeholder.com/500x400?text=Barang"
            :alt="barangStore.selectedBarang.name"
          />
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h1>{{ barangStore.selectedBarang.name }}</h1>

          <div class="meta-info">
            <span class="category">
              {{ barangStore.selectedBarang.category?.name ?? 'Tanpa Kategori' }}
            </span>
            <span
              class="stock"
              :class="{
                available: barangStore.selectedBarang.stock > 0,
                unavailable: barangStore.selectedBarang.stock === 0,
              }"
            >
              {{ barangStore.selectedBarang.stock > 0
                ? `Stock: ${barangStore.selectedBarang.stock}`
                : 'Habis' }}
            </span>
          </div>

          <div class="description">
            <h3>Deskripsi</h3>
            <p>{{ barangStore.selectedBarang.description ?? 'Tidak ada deskripsi' }}</p>
          </div>

          <div class="pricing">
            <div class="price-tag">
              <span class="label">Harga Sewa</span>
              <span class="amount">Rp{{ formatPrice(barangStore.selectedBarang.pricePerDay) }}</span>
              <span class="period">/hari</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions">
            <button
              v-if="barangStore.selectedBarang.stock > 0"
              class="btn-primary"
              @click="goToRent"
            >
              Sewa Sekarang
            </button>
            <button v-else class="btn-disabled" disabled>Barang Habis</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="not-found">
      <p>Barang tidak ditemukan</p>
      <router-link to="/">Kembali ke Katalog</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBarangStore } from '@/stores/barang'

const route = useRoute()
const barangStore = useBarangStore()

const barangId = Number(route.params.id)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const goToRent = () => {
  // TODO: Navigasi ke halaman sewa dengan barangId
  console.log('Sewa barang:', barangId)
  // router.push({ name: 'Sewa', params: { barangId } })
}

onMounted(async () => {
  await barangStore.loadBarangDetail(barangId)
})
</script>

<style scoped>
.barang-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: #0066cc;
  text-decoration: none;
  font-size: 1rem;
}

.back-link:hover {
  text-decoration: underline;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.1rem;
  color: #666;
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c00;
}

.error a,
.not-found a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.detail-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.image-section img {
  width: 100%;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.info-section h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.meta-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category {
  padding: 0.5rem 1rem;
  background-color: #e8f4fd;
  color: #0066cc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.stock {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.stock.available {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.stock.unavailable {
  background-color: #ffebee;
  color: #c62828;
}

.description {
  margin-bottom: 2rem;
}

.description h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.description p {
  color: #666;
  line-height: 1.6;
}

.pricing {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.price-tag {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-tag .label {
  color: #666;
  font-size: 0.9rem;
}

.price-tag .amount {
  font-size: 2rem;
  font-weight: bold;
  color: #0066cc;
}

.price-tag .period {
  color: #666;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-disabled {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
}

.btn-primary:hover {
  background-color: #0052a3;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn-disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .info-section h1 {
    font-size: 1.5rem;
  }

  .price-tag .amount {
    font-size: 1.5rem;
  }
}
</style>
