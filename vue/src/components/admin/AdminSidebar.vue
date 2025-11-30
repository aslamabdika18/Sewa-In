<template>
    <aside class="flex flex-col h-full bg-slate-900 text-slate-100">
        <!-- BRAND + CLOSE (mobile) -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-slate-800">
            <div class="flex items-center gap-2">
                <div
                    class="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
                    <span class="text-emerald-400 text-lg font-bold">S</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-semibold leading-tight">
                        Sewa-In Admin
                    </span>
                    <span class="text-[11px] text-slate-400">
                        Panel Pengelolaan
                    </span>
                </div>
            </div>

            <button type="button"
                class="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800"
                @click="$emit('close')">
                <XMarkIcon class="w-4 h-4" />
            </button>
        </div>

        <!-- NAV -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div>
                <p class="px-3 mb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    Overview
                </p>
                <div class="space-y-1.5">
                    <SidebarLink to="/admin" label="Dashboard" :icon="Squares2X2Icon" />
                    <SidebarLink to="/admin/orders" label="Pemesanan" :icon="ClipboardDocumentListIcon" :badge="12" />
                    <SidebarLink to="/admin/customers" label="Pelanggan" :icon="UserGroupIcon" />
                </div>
            </div>

            <div>
                <p class="px-3 mb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    Produk & Inventaris
                </p>
                <div class="space-y-1.5">
                    <SidebarLink to="/admin/items" label="Daftar Barang" :icon="CubeIcon" />
                    <SidebarLink to="/admin/categories" label="Kategori" :icon="TagIcon" />
                    <SidebarLink to="/admin/stocks" label="Stok & Ketersediaan" :icon="ChartBarIcon" />
                </div>
            </div>

            <div>
                <p class="px-3 mb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    Laporan
                </p>
                <div class="space-y-1.5">
                    <SidebarLink to="/admin/reports" label="Laporan Transaksi" :icon="DocumentMagnifyingGlassIcon" />
                    <SidebarLink to="/admin/settings" label="Pengaturan" :icon="Cog6ToothIcon" />
                </div>
            </div>
        </nav>

        <!-- FOOTER -->
        <div
            class="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between gap-3">
            <span>v1.0.0</span>

            <button type="button"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                @click="handleLogout">
                <ArrowRightOnRectangleIcon class="w-3.5 h-3.5" />
                <span>Keluar</span>
            </button>
        </div>

    </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ArrowRightOnRectangleIcon, /* ikon lain... */ } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logoutUser()
    await router.push({ name: 'sign-in' })
  } catch (error) {
    console.error('Logout gagal:', error)
  }
}

</script>
