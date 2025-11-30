<template>
    <div class="min-h-screen flex flex-col">
        <Navbar />

        <main class="pt-20 flex-1">
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>
