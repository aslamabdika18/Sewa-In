<template>
  <div class="min-h-screen">
    <!-- Navbar - Muncul HANYA jika layout = 'default' -->
    <Navbar v-if="showNavbarFooter" />

    <!-- Konten halaman - TAMBAHKAN padding-top -->
    <main :class="showNavbarFooter ? 'pt-20' : ''">
      <RouterView />
    </main>

    <!-- Footer - Muncul HANYA jika layout = 'default' -->
    <Footer v-if="showNavbarFooter" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

const showNavbarFooter = computed(() => {
  return route.meta.layout !== 'auth'
})
</script>