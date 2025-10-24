<template>
    <footer class="bg-gray-900 text-gray-300 py-16">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="grid md:grid-cols-4 gap-12 mb-12">
                    <div class="md:col-span-1">
                        <div class="flex items-center space-x-3 mb-6">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                                <svg class="text-white w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <span class="text-2xl font-bold text-white">Sewa-In</span>
                        </div>
                        <p class="text-gray-400 mb-6 leading-relaxed">
                            Mewujudkan petualangan impian dengan peralatan outdoor premium dan terpercaya.
                        </p>
                        <div class="flex space-x-4">
                            <a v-for="index in 4" :key="index" href="#"
                                class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div v-for="(section, index) in footerSections" :key="index">
                        <h4 class="text-white font-bold text-lg mb-6">{{ section.title }}</h4>
                        <ul class="space-y-3">
                            <li v-for="(link, i) in section.links" :key="i">
                                <a href="#" class="hover:text-emerald-500 transition-colors">{{ link }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-gray-800 pt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p class="text-gray-500 text-sm">
                            © 2024 Sewa-In. Petualangan Tanpa Batas. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
</template>
<script setup lang="ts">
interface FooterSection {
    title: string
    links: string[]
}

const footerSections: FooterSection[] = [
    {
        title: 'Peralatan',
        links: ['Tenda & Shelter', 'Carrier & Tas', 'Sleeping Gear', 'Cooking Set', 'Paket Lengkap']
    },
    {
        title: 'Perusahaan',
        links: ['Tentang Kami', 'Komunitas', 'Blog & Artikel', 'Karir', 'Press Kit']
    },
    {
        title: 'Dukungan',
        links: ['Help Center', 'FAQ', 'Syarat & Ketentuan', 'Privacy Policy', 'Hubungi Kami']
    }
]
</script>