<template>
    <div class="space-y-6">
        <!-- Stats -->
        <AdminStatsOverview />

        <div class="grid gap-6 xl:grid-cols-3">
            <!-- Orders table -->
            <div class="space-y-6 xl:col-span-2">
                <AdminOrdersTable />
            </div>

            <!-- Side widgets -->
            <div class="space-y-6">
                <AdminSideWidgets />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AdminStatsOverview from '@/components/admin/AdminStatsOverview.vue'
import AdminOrdersTable from '@/components/admin/AdminOrdersTable.vue'
import AdminSideWidgets from '@/components/admin/AdminSideWidgets.vue'
</script>
