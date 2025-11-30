<template>
    <section class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="p-3">
                <ShieldCheckIcon class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                <p class="text-xs md:text-sm font-medium text-gray-800">Pembayaran Aman</p>
            </div>
            <div class="p-3">
                <ClockIcon class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                <p class="text-xs md:text-sm font-medium text-gray-800">Support 24/7</p>
            </div>
            <div class="p-3">
                <ArrowPathIcon class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                <p class="text-xs md:text-sm font-medium text-gray-800">Pembatalan Fleksibel</p>
            </div>
            <div class="p-3">
                <CheckCircleIcon class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                <p class="text-xs md:text-sm font-medium text-gray-800">Owner Terverifikasi</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    ShieldCheckIcon,
    ClockIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'
</script>
