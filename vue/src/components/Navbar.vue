<template>
    <nav :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
            : 'bg-white/80 backdrop-blur-md shadow-md'
    ]">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="flex items-center justify-between h-20">
                <!-- Logo -->
                <RouterLink to="/" class="flex items-center space-x-3">
                    <div
                        class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <MapIcon class="text-white w-6 h-6" />
                    </div>
                    <span class="text-2xl font-bold text-gray-900">Sewa-In</span>
                </RouterLink>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <RouterLink to="/" 
                        :class="[
                            'font-medium transition-colors',
                            $route.path === '/' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                        ]">
                        Beranda
                    </RouterLink>

                    <RouterLink to="/tools"
                        :class="[
                            'font-medium transition-colors',
                            $route.path === '/tools' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                        ]">
                        Peralatan
                    </RouterLink>

                    <RouterLink to="/about"
                        :class="[
                            'font-medium transition-colors',
                            $route.path === '/about' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                        ]">
                        Tentang Kami
                    </RouterLink>
                </div>

                <!-- Desktop Auth Button -->
                <div class="hidden md:flex items-center space-x-4">
                    <RouterLink to="/sign-in"
                        class="px-5 py-2.5 text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                        Masuk
                    </RouterLink>
                </div>

                <!-- Mobile Menu Button -->
                <button 
                    @click="mobileMenuOpen = true"
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                    <Bars3Icon class="w-6 h-6 text-gray-900" />
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition name="overlay">
        <div 
            v-if="mobileMenuOpen"
            @click="mobileMenuOpen = false"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden">
        </div>
    </Transition>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
        <div 
            v-if="mobileMenuOpen"
            class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[70] md:hidden overflow-y-auto">
            
            <!-- Mobile Menu Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <MapIcon class="text-white w-6 h-6" />
                    </div>
                    <span class="text-xl font-bold text-gray-900">Sewa-In</span>
                </div>
                <button 
                    @click="mobileMenuOpen = false"
                    class="p-2 rounded-lg hover:bg-gray-100 transition">
                    <XMarkIcon class="w-6 h-6 text-gray-900" />
                </button>
            </div>

            <!-- Mobile Menu Content -->
            <div class="p-6">
                <!-- Navigation Links -->
                <nav class="space-y-2 mb-8">
                    <RouterLink 
                        to="/" 
                        @click="mobileMenuOpen = false"
                        :class="[
                            'flex items-center px-4 py-3 rounded-lg font-medium transition-colors',
                            $route.path === '/' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <HomeIcon class="w-5 h-5 mr-3" />
                        Beranda
                    </RouterLink>

                    <RouterLink 
                        to="/tools"
                        @click="mobileMenuOpen = false"
                        :class="[
                            'flex items-center px-4 py-3 rounded-lg font-medium transition-colors',
                            $route.path === '/tools' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <WrenchScrewdriverIcon class="w-5 h-5 mr-3" />
                        Peralatan
                    </RouterLink>

                    <RouterLink 
                        to="/about"
                        @click="mobileMenuOpen = false"
                        :class="[
                            'flex items-center px-4 py-3 rounded-lg font-medium transition-colors',
                            $route.path === '/about' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <InformationCircleIcon class="w-5 h-5 mr-3" />
                        Tentang Kami
                    </RouterLink>
                </nav>

                <!-- Auth Buttons -->
                <div class="space-y-3">
                    <RouterLink 
                        to="/sign-in"
                        @click="mobileMenuOpen = false"
                        class="block w-full px-5 py-3 text-center text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-300">
                        Masuk
                    </RouterLink>
                    
                    <button 
                        class="w-full px-5 py-3 text-center text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300">
                        Daftar Sekarang
                    </button>
                </div>

                <!-- Additional Info -->
                <div class="mt-8 pt-6 border-t border-gray-200">
                    <p class="text-sm text-gray-500 mb-4">Butuh Bantuan?</p>
                    <a href="mailto:support@sewa-in.com" class="flex items-center text-sm text-gray-700 hover:text-emerald-600 transition mb-3">
                        <EnvelopeIcon class="w-5 h-5 mr-2" />
                        support@sewa-in.com
                    </a>
                    <a href="tel:+6281234567890" class="flex items-center text-sm text-gray-700 hover:text-emerald-600 transition">
                        <PhoneIcon class="w-5 h-5 mr-2" />
                        +62 812-3456-7890
                    </a>
                </div>

                <!-- Social Media -->
                <div class="mt-6">
                    <p class="text-sm text-gray-500 mb-3">Ikuti Kami</p>
                    <div class="flex space-x-3">
                        <a href="#" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
    MapIcon, 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    WrenchScrewdriverIcon,
    InformationCircleIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

// Close mobile menu when route changes
watch(() => route.path, () => {
    mobileMenuOpen.value = false
})

// Prevent body scroll when mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.body.style.overflow = '' // Cleanup
})
</script>

<style scoped>
/* Overlay Transitions */
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

/* Slide Transitions */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-enter-from {
    transform: translateX(100%);
}

.slide-leave-to {
    transform: translateX(100%);
}
</style> 