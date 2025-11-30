<template>
    <header class="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
            <!-- LEFT: Toggle + Title -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <!-- Mobile toggle -->
                <button type="button"
                    class="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors w-10 h-10 shrink-0"
                    @click="$emit('toggle-sidebar')">
                    <Bars3Icon class="w-5 h-5" />
                </button>

                <div class="hidden md:block truncate">
                    <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
                        {{ pageTitle }}
                    </p>
                    <h1 class="text-lg font-semibold text-slate-900 truncate">
                        {{ pageTitle }}
                    </h1>
                </div>
            </div>

            <!-- RIGHT: Search + Actions -->
            <div class="flex items-center gap-3">
                <!-- Search (desktop) -->
                <div class="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 min-w-[220px]">
                    <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 mr-2" />
                    <input type="text" placeholder="Cari sesuatu..."
                        class="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full" />
                </div>

                <!-- Notification -->
                <button type="button"
                    class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative">
                    <BellIcon class="w-5 h-5" />
                    <span
                        class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center">
                        3
                    </span>
                </button>

                <!-- User info -->
                <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
                    <div
                        class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                        {{ userInitial }}
                    </div>
                    <div class="hidden sm:flex flex-col">
                        <span class="text-xs font-medium text-slate-900">
                            {{ userName }}
                        </span>
                        <span class="text-[11px] text-slate-500">
                            {{ userRole }}
                        </span>
                    </div>
                </div>

                <!-- Tombol Logout -->
                <button type="button"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    @click="handleLogout" :disabled="authLoading">
                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    <span class="hidden sm:inline">
                        Keluar
                    </span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

defineEmits<{
    (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
    if (typeof route.meta.title === 'string') return route.meta.title
    return 'Dashboard'
})

const userName = computed(() => authStore.user?.name ?? 'Admin')
const userRole = computed(() =>
    authStore.user?.role === 'ADMIN' ? 'Super Admin' : 'User'
)
const userInitial = computed(() => {
    const name = authStore.user?.name ?? ''
    return name.trim() ? name.trim().charAt(0).toUpperCase() : 'A'
})

const authLoading = computed(() => authStore.loading)

const handleLogout = async () => {
    try {
        await authStore.logoutUser()
        await router.push({ name: 'sign-in' })
    } catch (error) {
        console.error('Logout gagal:', error)
        // kalau mau, bisa tampilkan toast error di sini
    }
}
</script>
