<template>
    <div class="h-screen min-h-screen bg-slate-100 flex overflow-hidden">
        <!-- SIDEBAR DESKTOP -->
        <aside
            class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-slate-900 text-slate-100 border-r border-slate-800">
            <AdminSidebar />
        </aside>

        <!-- OVERLAY & DRAWER MOBILE -->
        <div v-if="isSidebarOpen" class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            @click="isSidebarOpen = false" />

        <aside v-if="isSidebarOpen"
            class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 lg:hidden flex flex-col">
            <AdminSidebar @close="isSidebarOpen = false" />
        </aside>

        <!-- MAIN AREA (TOPBAR + CONTENT) -->
        <div class="flex-1 flex flex-col w-full lg:ml-64">
            <!-- Topbar selalu di atas (tidak ikut scroll main) -->
            <AdminTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

            <!-- Hanya bagian ini yang scroll -->
            <main class="flex-1 overflow-y-auto">
                <div class="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'

const isSidebarOpen = ref(false)
</script>
