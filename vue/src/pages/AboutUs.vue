<template>
    <div class="font-sans bg-gray-50 text-gray-800">
        <!-- Hero Section -->
        <section class="pb-20 md:pt-10 md:pb-28 bg-gradient-to-br from-emerald-600 to-emerald-800 min-h-screen flex items-center justify-center text-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="uppercase tracking-wider text-sm mb-4 text-emerald-100">Perjalanan Kami Dimulai dari</p>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                    Membuat Sewa-Menyewa Menjadi Mudah untuk Semua Orang
                </h1>
                <p class="text-lg md:text-xl max-w-3xl mx-auto text-emerald-50">
                    Sejak 2022, Sewa-In telah membantu 50,000+ orang mengakses barang yang mereka butuhkan tanpa harus membeli
                </p>
                <div class="mt-12 animate-bounce">
                    <ChevronDownIcon class="w-8 h-8 mx-auto" />
                </div>
            </div>
        </section>

        <!-- Company Overview -->
        <section class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                    <div class="md:w-1/2 relative">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                             alt="Tim Sewa-In" class="rounded-xl shadow-lg w-full">
                        <div class="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md">
                            <span class="font-bold">Est. 2022</span>
                        </div>
                    </div>
                    
                    <div class="md:w-1/2">
                        <p class="text-emerald-600 font-semibold mb-2">Tentang Sewa-In</p>
                        <h2 class="text-3xl md:text-4xl font-bold mb-6">Platform Rental yang Menghubungkan Pemilik & Penyewa</h2>
                        
                        <p class="mb-4 text-gray-600 leading-relaxed">
                            Sewa-In lahir dari pengalaman pribadi founder kami yang kesulitan menyewa kamera untuk kebutuhan mendadak. Kami menyadari bahwa proses sewa-menyewa di Indonesia masih terlalu rumit dan tidak terpercaya.
                        </p>
                        
                        <p class="mb-4 text-gray-600 leading-relaxed">
                            Kami percaya bahwa kepemilikan bukan satu-satunya cara untuk mengakses barang berkualitas. Dengan teknologi dan komunitas yang kuat, Sewa-In hadir untuk menjawab kebutuhan ini dengan cara yang aman, mudah, dan menguntungkan semua pihak.
                        </p>
                        
                        <p class="mb-6 text-gray-600 leading-relaxed">
                            Hari ini, Sewa-In telah berkembang menjadi platform terdepan di Indonesia dengan ribuan aset berkualitas yang siap disewakan. Misi kami adalah membuat akses ke barang-barang berkualitas menjadi lebih demokratis.
                        </p>
                        
                        <RouterLink to="/tools" class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-300 font-medium">
                            Lihat Bagaimana Kami Kerja
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mission, Vision & Values -->
        <section class="py-16 md:py-24 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Nilai-Nilai Inti Kami</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Fondasi yang membangun budaya dan layanan Sewa-In
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Mission -->
                    <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                        <div class="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <TargetIcon class="text-emerald-600 w-8 h-8" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Misi Kami</h3>
                        <p class="text-gray-600 leading-relaxed">
                            "Memudahkan akses ke berbagai aset dengan membangun ekosistem sewa-menyewa yang aman, terpercaya, dan saling menguntungkan"
                        </p>
                    </div>
                    
                    <!-- Vision -->
                    <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                        <div class="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <EyeIcon class="text-emerald-600 w-8 h-8" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Visi Kami</h3>
                        <p class="text-gray-600 leading-relaxed">
                            "Menjadi platform rental #1 di Indonesia yang memberdayakan ekonomi berbagi dan mendorong konsumsi berkelanjutan"
                        </p>
                    </div>
                    
                    <!-- Values -->
                    <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                        <div class="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <HeartIcon class="text-emerald-600 w-8 h-8" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Nilai Kami</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li v-for="value in values" :key="value" class="flex items-start">
                                <CheckIcon class="text-emerald-500 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{{ value }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Statistics -->
        <section class="py-16 md:py-24 bg-emerald-600 text-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Dampak yang Kami Ciptakan</h2>
                    <p class="text-lg text-emerald-50 max-w-3xl mx-auto">
                        Angka-angka yang berbicara tentang perjalanan kami
                    </p>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div v-for="stat in stats" :key="stat.label" class="text-center">
                        <div ref="statsRefs" class="text-4xl md:text-5xl font-bold mb-2" :data-target="stat.value">
                            {{ stat.displayValue }}
                        </div>
                        <p class="text-sm uppercase tracking-wider text-emerald-100">{{ stat.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Values Deep Dive -->
        <section class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Apa yang Membuat Kami Berbeda</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Nilai-nilai yang tidak hanya kami ucapkan, tapi kami jalankan setiap hari
                    </p>
                </div>
                
                <!-- Trust First -->
                <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
                    <div class="md:w-1/2">
                        <div class="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheckIcon class="text-emerald-600 w-8 h-8" />
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold mb-4">Trust First</h3>
                        <p class="text-gray-600 mb-4 leading-relaxed">
                            Kepercayaan adalah dasar dari semua transaksi di Sewa-In. Kami membangun sistem keamanan berlapis untuk melindungi semua pihak:
                        </p>
                        <ul class="space-y-3 text-gray-600">
                            <li v-for="item in trustFeatures" :key="item" class="flex items-start">
                                <CheckIcon class="text-emerald-500 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop" 
                             alt="Keamanan Sewa-In" class="rounded-xl shadow-lg w-full">
                    </div>
                </div>
                
                <!-- Innovation -->
                <div class="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div class="md:w-1/2">
                        <div class="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <BoltIcon class="text-emerald-600 w-8 h-8" />
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold mb-4">Innovation Always</h3>
                        <p class="text-gray-600 mb-4 leading-relaxed">
                            Teknologi adalah DNA kami. Kami terus berinovasi untuk memberikan pengalaman terbaik:
                        </p>
                        <ul class="space-y-3 text-gray-600">
                            <li v-for="item in innovationFeatures" :key="item" class="flex items-start">
                                <CheckIcon class="text-emerald-500 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
                             alt="Inovasi Sewa-In" class="rounded-xl shadow-lg w-full">
                    </div>
                </div>
            </div>
        </section>

        <!-- Timeline -->
        <section class="py-16 md:py-24 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Perjalanan Kami</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Dari ide sederhana menjadi platform rental terdepan di Indonesia
                    </p>
                </div>
                
                <div class="relative max-w-4xl mx-auto">
                    <div class="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-emerald-200"></div>
                    
                    <div v-for="(milestone, index) in timeline" :key="index" class="relative pl-12 md:pl-20 mb-12">
                        <div class="absolute left-2 md:left-5 top-2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow"></div>
                        
                        <div :class="milestone.isFuture ? 'bg-emerald-50 border-2 border-emerald-200 border-dashed' : 'bg-white shadow-md'" 
                             class="p-6 md:p-8 rounded-xl hover:shadow-lg transition duration-300">
                            <div class="text-emerald-600 font-bold mb-2">{{ milestone.date }}</div>
                            <h3 class="text-xl font-bold mb-3">{{ milestone.title }}</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li v-for="(item, idx) in milestone.items" :key="idx" class="flex items-start">
                                    <span class="mr-2">•</span>
                                    <span>{{ item }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team -->
        <section class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Tim di Balik Sewa-In</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Kenalan dengan orang-orang yang membuat semua ini terjadi
                    </p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div v-for="member in team" :key="member.name" 
                         class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 group">
                        <div class="relative overflow-hidden">
                            <img :src="member.image" :alt="member.name" class="w-full h-64 object-cover group-hover:scale-105 transition duration-300">
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold">{{ member.name }}</h3>
                            <p class="text-emerald-600 text-sm mb-3">{{ member.role }}</p>
                            <p class="text-gray-500 italic text-sm">"{{ member.quote }}"</p>
                        </div>
                    </div>
                </div>
                
                <!-- Join Team CTA -->
                <div class="mt-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 md:p-12 text-center">
                    <div class="max-w-2xl mx-auto">
                        <BriefcaseIcon class="w-12 h-12 text-white mx-auto mb-4" />
                        <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Bergabung dengan Tim Kami</h3>
                        <p class="text-emerald-50 mb-6">
                            Kami mencari individu passionate yang ingin membuat impact di dunia rental. Jika Anda menyukai tantangan dan ingin bekerja di lingkungan yang dinamis, kami ingin mendengar dari Anda!
                        </p>
                        <a href="#" class="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition duration-300 font-medium">
                            Lihat Posisi Terbuka
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sustainability -->
        <section class="py-16 md:py-24 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-center gap-12">
                    <div class="md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop" 
                             alt="Sustainability" class="rounded-xl shadow-lg w-full">
                    </div>
                    
                    <div class="md:w-1/2">
                        <h2 class="text-3xl md:text-4xl font-bold mb-6">Komitmen Kami untuk Keberlanjutan</h2>
                        <p class="text-gray-600 mb-6 leading-relaxed">
                            Sewa-In percaya pada ekonomi berbagi yang tidak hanya menguntungkan secara finansial, tetapi juga ramah lingkungan. Dengan memaksimalkan utilisasi aset yang ada, kami mengurangi jejak karbon dari produksi barang baru.
                        </p>
                        
                        <div class="space-y-6">
                            <div v-for="item in sustainability" :key="item.title" class="flex items-start">
                                <div class="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                                    <component :is="item.icon" class="text-emerald-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h4 class="font-bold mb-1">{{ item.title }}</h4>
                                    <p class="text-gray-600">{{ item.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Siap Memulai?</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Bergabunglah dengan komunitas penyewa dan pemilik aset terbesar di Indonesia
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div class="bg-emerald-50 p-8 rounded-xl text-center hover:shadow-lg transition duration-300">
                        <h3 class="text-xl font-bold mb-3">Mulai Menyewa</h3>
                        <p class="text-gray-600 mb-6">Temukan ribuan item siap sewa untuk semua kebutuhan Anda</p>
                        <RouterLink to="/tools" class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-300">
                            Jelajahi Katalog
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </RouterLink>
                    </div>
                    
                    <div class="bg-green-50 p-8 rounded-xl text-center hover:shadow-lg transition duration-300">
                        <h3 class="text-xl font-bold mb-3">Daftarkan Aset Anda</h3>
                        <p class="text-gray-600 mb-6">Hasilkan pendapatan tambahan dari barang yang jarang digunakan</p>
                        <a href="#" class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                            Daftar Sekarang
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
    ChevronDownIcon, 
    ArrowRightIcon, 
    CheckIcon,
    ShieldCheckIcon,
    BoltIcon,
    HeartIcon,
    EyeIcon,
    BriefcaseIcon
} from '@heroicons/vue/24/outline'
import { 
    SparklesIcon as TargetIcon,
} from '@heroicons/vue/24/solid'

const statsRefs = ref<HTMLElement[]>([])

const values = [
    'Trust First',
    'Innovation Always',
    'Community Driven',
    'Sustainable Growth',
    'User Empowerment'
]

const stats = ref([
    { value: 50000, displayValue: '50,000+', label: 'Pengguna Aktif' },
    { value: 15000, displayValue: '15,000+', label: 'Aset Listed' },
    { value: 4.8, displayValue: '4.8/5.0', label: 'Rating Users' },
    { value: 500000, displayValue: '500K+', label: 'Trans. Sukses' }
])

const trustFeatures = [
    'Verifikasi KYC untuk semua pengguna',
    'Sistem pembayaran escrow yang aman',
    'Asuransi untuk setiap transaksi',
    'Tim verifikasi aset berkualitas'
]

const innovationFeatures = [
    'AI matching untuk rekomendasi aset terbaik',
    'Smart pricing untuk harga yang adil',
    'Kontrak digital otomatis',
    'Prediksi ketersediaan real-time'
]

const timeline = [
    {
        date: '2022 Q1',
        title: 'Humble Beginnings',
        items: [
            'Ide Sewa-In lahir dari pengalaman pribadi',
            '3 founder dengan latar belakang berbeda',
            '3 bulan research & validasi pasar'
        ],
        isFuture: false
    },
    {
        date: '2022 Q3',
        title: 'MVP Launch',
        items: [
            'Soft launch dengan 50 early adopters',
            'Fokus pada kategori kamera & elektronik',
            'Bangun sistem verifikasi & asuransi pertama'
        ],
        isFuture: false
    },
    {
        date: '2023 Q1',
        title: 'Growth Phase',
        items: [
            'Series A funding $2M',
            'Ekspansi ke 10 kota besar Indonesia',
            'Pertumbuhan tim dari 3 menjadi 25 orang'
        ],
        isFuture: false
    },
    {
        date: '2025+',
        title: "What's Next",
        items: [
            'Ekspansi ke 100 kota di Indonesia',
            'Peluncuran internasional (Singapore, Malaysia)',
            'AI-powered recommendation engine'
        ],
        isFuture: true
    }
]

const team = [
    {
        name: 'Budi Santoso',
        role: 'CEO & Co-Founder',
        quote: 'Kami membangun lebih dari platform - kami membangun kepercayaan dalam cara baru mengakses barang',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
        name: 'Ani Wijaya',
        role: 'CTO & Co-Founder',
        quote: 'Teknologi harus memecahkan masalah nyata dengan cara yang elegan dan mudah digunakan',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
        name: 'Doni Pratama',
        role: 'COO & Co-Founder',
        quote: 'Logistik adalah tulang punggung bisnis kami - kami membuatnya tak terlihat bagi user',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    }
]

const sustainability = [
    {
        icon: SparklesIcon,
        title: 'Carbon Footprint',
        description: 'Mengurangi jejak karbon hingga 30% dibanding model kepemilikan tradisional'
    },
    {
        icon: ArrowPathIcon,
        title: 'Circular Economy',
        description: '1M+ items shared daripada diproduksi baru sejak 2022'
    },
    {
        icon: HeartIcon,
        title: 'Community Programs',
        description: 'Program rental gratis untuk NGO dan komunitas sosial'
    }
]

// Import additional icons for sustainability
import { SparklesIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

onMounted(() => {
    // Intersection Observer for stat animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                const target = entry.target.dataset.target
                if (target) {
                    animateValue(entry.target, parseFloat(target))
                    observer.unobserve(entry.target)
                }
            }
        })
    }, { threshold: 0.5 })

    statsRefs.value.forEach(el => {
        if (el) observer.observe(el)
    })
})

function animateValue(element: HTMLElement, target: number) {
    const duration = 2000
    const start = 0
    const increment = target / (duration / 16)
    let current = start

    const timer = setInterval(() => {
        current += increment
        if (current >= target) {
            current = target
            clearInterval(timer)
        }
        
        if (target === 4.8) {
            element.textContent = current.toFixed(1) + '/5.0'
        } else if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString('id-ID') + '+'
        } else {
            element.textContent = Math.floor(current).toLocaleString('id-ID')
        }
    }, 16)
}
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}
</style>