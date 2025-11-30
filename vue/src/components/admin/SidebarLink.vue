<template>
    <RouterLink :to="to"
        class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors" :class="isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            ">
        <component :is="icon" class="w-5 h-5" />
        <span class="truncate">{{ label }}</span>

        <span v-if="badge !== undefined"
            class="ml-auto inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] px-2 py-0.5">
            {{ badge }}
        </span>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
    to: string
    label: string
    icon: any
    badge?: string | number
}>()

const route = useRoute()

const isActive = computed(() => {
    if (props.to === '/') return route.path === '/'
    return route.path.startsWith(props.to)
})
</script>
