<template>
    <div class="mb-10">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl md:text-3xl font-black text-gray-900">
                Selesaikan Penyewaanmu
            </h1>
            <span class="text-sm text-gray-500">
                Step {{ currentStep }} dari {{ totalSteps }}
            </span>
        </div>

        <div class="flex items-center gap-3 md:gap-4">
            <div v-for="step in steps" :key="step.number" class="flex flex-col items-center flex-1">
                <div class="flex items-center" :class="{ 'w-full': step.number !== totalSteps }">
                    <!-- Circle -->
                    <div class="flex items-center justify-center w-9 h-9 rounded-full border-2 text-xs font-semibold transition-all"
                        :class="circleClass(step.number)">
                        <span v-if="step.number < currentStep">✓</span>
                        <span v-else>{{ step.number }}</span>
                    </div>

                    <!-- Divider -->
                    <div v-if="step.number !== totalSteps" class="flex-1 h-px ml-3 md:ml-4"
                        :class="step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-300'" />
                </div>

                <span class="mt-2 text-[11px] md:text-xs font-semibold tracking-wide uppercase" :class="step.number === currentStep
                        ? 'text-emerald-600'
                        : step.number < currentStep
                            ? 'text-emerald-500'
                            : 'text-gray-400'
                    ">
                    {{ step.label }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface StepItem {
    number: number
    label: string
}

const props = defineProps<{
    currentStep: number
    totalSteps?: number
}>()

const totalSteps = props.totalSteps ?? 4

const steps: StepItem[] = [
    { number: 1, label: 'Detail Sewa' },
    { number: 2, label: 'Data Penyewa' },
    { number: 3, label: 'Pembayaran' },
    { number: 4, label: 'Konfirmasi' }
]

const circleClass = (stepNumber: number) => {
    if (stepNumber < props.currentStep) {
        return 'border-emerald-500 bg-emerald-500 text-white'
    }
    if (stepNumber === props.currentStep) {
        return 'border-emerald-500 bg-emerald-50 text-emerald-700'
    }
    return 'border-gray-300 bg-white text-gray-500'
}
</script>
