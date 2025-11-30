<template>
    <div
        class="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
        <!-- Biarkan halaman yang pakai layout auth yg ngatur max-width sendiri -->
        <slot />
    </div>
</template>

<script setup lang="ts"></script>
