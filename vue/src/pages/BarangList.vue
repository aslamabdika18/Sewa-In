<template>
  <div class="barang-list-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container mx-auto px-4 sm:px-6 py-8">
        <h1 class="text-4xl font-bold mb-2">Katalog Lengkap</h1>
        <p class="text-gray-600">Temukan semua peralatan sewa yang tersedia</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-12">
      <Catalog />
    </div>
  </div>
</template>

<script setup lang="ts">
import Catalog from '@/components/catalog/Catalog.vue'
</script>

<style scoped>
.barang-list-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.page-header {
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  color: white;
  border-bottom: 4px solid #10b981;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #d1fae5;
}
</style>
