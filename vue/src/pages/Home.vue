<template>
    <div>
        <!-- Hero Section -->
        <section class="hero-background pt-20 pb-20 md:pt-10 md:pb-32 relative">
            <div class="container mx-auto px-4 sm:px-6 relative z-10">
                <div class="flex flex-col lg:flex-row items-center gap-12">
                    <div class="lg:w-1/2 text-white">
                        <div
                            class="inline-block mb-6 px-4 py-2 glass-effect rounded-full text-sm font-semibold animate-fade-in">
                            🏕️ Dipercaya 25,000+ Petualang
                        </div>

                        <h1 class="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-slide-up">
                            Petualangan Tanpa Batas,<br />
                            <span class="text-orange-400">Tanpa Harus Memiliki</span>
                        </h1>

                        <p class="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed animate-slide-up"
                            style="animation-delay: 0.1s">
                            Dari puncak gunung hingga tepi pantai. Sewa peralatan outdoor premium dan wujudkan setiap
                            mimpi petualangan Anda.
                        </p>

                        <div class="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up"
                            style="animation-delay: 0.2s">
                            <a href="#equipment"
                                class="group px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center">
                                Jelajahi Peralatan
                                <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a href="#how"
                                class="px-8 py-4 glass-effect text-white font-bold rounded-xl hover:bg-white hover:text-emerald-700 transition-all duration-300 text-center flex items-center justify-center">
                                <svg class="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cara Kerja
                            </a>
                        </div>

                        <div class="flex flex-wrap gap-8 animate-fade-in" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-2">
                                <div class="w-12 h-12 glass-effect rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-bold text-lg">100% Aman</div>
                                    <div class="text-sm text-gray-200">Terverifikasi & Terasuransi</div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <div class="w-12 h-12 glass-effect rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-bold text-lg">24 Jam</div>
                                    <div class="text-sm text-gray-200">Siap Dikirim</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:w-1/2 relative animate-float">
                        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop"
                                alt="Adventure Equipment" class="w-full h-auto">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        <div class="absolute -left-6 top-20 glass-effect text-white p-4 rounded-xl shadow-xl animate-float"
                            style="animation-delay: 0.5s">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-bold">Tenda Premium</div>
                                    <div class="text-sm text-gray-200">Rp 75K/hari</div>
                                </div>
                            </div>
                        </div>

                        <div class="absolute -right-6 bottom-20 glass-effect text-white p-4 rounded-xl shadow-xl animate-float"
                            style="animation-delay: 1s">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-bold">Carrier 60L</div>
                                    <div class="text-sm text-gray-200">Rp 50K/hari</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div class="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                    <div class="w-1 h-3 bg-white rounded-full animate-bounce"></div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div v-for="(stat, index) in stats" :key="index" class="text-center reveal"
                        :style="{ transitionDelay: `${index * 0.1}s` }">
                        <div class="text-5xl font-black gradient-text mb-2">{{ stat.number }}</div>
                        <div class="text-gray-600 font-medium">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Value Proposition -->
        <section id="adventure" class="py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="text-center mb-16 reveal">
                    <div
                        class="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                        KENAPA SEWA-IN?
                    </div>
                    <h2 class="text-4xl md:text-5xl font-black mb-6">
                        Lebih Dari Sekedar <span class="gradient-text">Sewa Peralatan</span>
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Kami memahami bahwa setiap petualangan adalah cerita yang berharga. Itulah mengapa kami hadir
                        dengan solusi yang membebaskan Anda dari beban kepemilikan.
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="(item, index) in valueProps" :key="index"
                        class="reveal bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-3 transition-all duration-300"
                        :style="{ transitionDelay: `${index * 0.1}s` }">
                        <div
                            :class="['w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 transform', item.gradient, item.rotation]">
                            <svg class="text-white w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="item.iconType === 'heart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                <path v-else-if="item.iconType === 'bolt'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">{{ item.title }}</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">{{ item.description }}</p>
                        <ul class="space-y-2 text-gray-600">
                            <li v-for="(feature, i) in item.features" :key="i" class="flex items-center">
                                <svg class="w-5 h-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{{ feature }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Equipment Showcase -->
        <section id="equipment" class="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="text-center mb-12 reveal">
                    <h2 class="text-4xl md:text-5xl font-black mb-6">
                        Peralatan <span class="gradient-text">Premium</span> Kami
                    </h2>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Koleksi lengkap untuk setiap jenis petualangan
                    </p>
                </div>

                <div class="flex flex-wrap justify-center gap-3 mb-12 reveal">
                    <button v-for="category in categories" :key="category.id" @click="activeCategory = category.id"
                        :class="[
                            'px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300',
                            activeCategory === category.id
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]">
                        {{ category.icon }} {{ category.label }}
                    </button>
                </div>

                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="(item, index) in filteredEquipment" :key="item.id"
                        class="reveal bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        :style="{ transitionDelay: `${index * 0.1}s` }">
                        <div class="relative overflow-hidden">
                            <div
                                class="w-full h-56 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <svg class="w-20 h-20 text-emerald-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div v-if="item.badge"
                                :class="['absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold', item.badgeColor]">
                                {{ item.badge }}
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center gap-2 mb-2">
                                <span
                                    class="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded uppercase">
                                    {{ item.category }}
                                </span>
                            </div>
                            <h3 class="text-xl font-bold mb-2">{{ item.name }}</h3>
                            <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-2xl font-black text-emerald-600">Rp {{ item.price }}</div>
                                    <div class="text-sm text-gray-500">/hari</div>
                                </div>
                                <button
                                    class="w-12 h-12 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:scale-110 transition-all duration-300 flex items-center justify-center">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-12 reveal">
                    <a href="#"
                        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Lihat Semua Peralatan
                        <svg class="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section id="how" class="py-24 bg-white">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="text-center mb-16 reveal">
                    <h2 class="text-4xl md:text-5xl font-black mb-6">
                        Mudah, <span class="gradient-text">Cepat, Aman</span>
                    </h2>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Hanya 3 langkah untuk memulai petualangan Anda
                    </p>
                </div>

                <div class="relative">
                    <div
                        class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transform -translate-y-1/2 z-0">
                    </div>

                    <div class="grid md:grid-cols-3 gap-8 relative z-10">
                        <div v-for="(step, index) in steps" :key="index" class="reveal text-center"
                            :style="{ transitionDelay: `${index * 0.1}s` }">
                            <div
                                :class="['w-24 h-24 bg-gradient-to-br rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:scale-110 transition-transform duration-300', step.gradient]">
                                <svg class="text-white w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path v-if="step.iconType === 'search'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    <path v-else-if="step.iconType === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v-6a2 2 0 114 0v6m-4 0a2 2 0 01-2-2m6 2a2 2 0 002-2M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7z" />
                                </svg>
                            </div>
                            <div class="bg-white rounded-2xl p-8 shadow-lg">
                                <div class="text-6xl font-black text-gray-100 mb-2">{{ step.number }}</div>
                                <h3 class="text-2xl font-bold mb-4">{{ step.title }}</h3>
                                <p class="text-gray-600 leading-relaxed">{{ step.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Community Stories -->
        <section id="story" class="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="text-center mb-16 reveal">
                    <div
                        class="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                        CERITA PETUALANG
                    </div>
                    <h2 class="text-4xl md:text-5xl font-black mb-6">
                        Suara <span class="gradient-text">Komunitas</span> Kami
                    </h2>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Ribuan petualang telah mempercayai Sewa-In untuk mewujudkan impian mereka
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="(testimonial, index) in testimonials" :key="index"
                        class="reveal bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        :style="{ transitionDelay: `${index * 0.1}s` }">
                        <div class="flex items-center mb-6">
                            <div
                                class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-emerald-100">
                                {{ testimonial.name[0] }}
                            </div>
                            <div class="ml-4">
                                <div class="font-bold text-lg">{{ testimonial.name }}</div>
                                <div class="text-gray-600 text-sm">{{ testimonial.trip }}</div>
                            </div>
                        </div>
                        <div class="flex mb-4">
                            <svg v-for="n in testimonial.rating" :key="n"
                                class="text-yellow-400 w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <p class="text-gray-700 leading-relaxed">{{ testimonial.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section
            class="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 sm:px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center text-white">
                    <div
                        class="inline-block mb-6 px-6 py-3 glass-effect rounded-full text-sm font-bold animate-fade-in">
                        🎉 Promo Spesial: Diskon 30% untuk Member Baru
                    </div>

                    <h2 class="text-4xl md:text-6xl font-black mb-6 leading-tight animate-slide-up">
                        Petualangan Menanti.<br />
                        Kapan Anda Mulai?
                    </h2>

                    <p class="text-xl md:text-2xl mb-12 text-gray-100 leading-relaxed animate-slide-up"
                        style="animation-delay: 0.1s">
                        Jangan biarkan keterbatasan menahan impian. Mulai petualangan pertama Anda hari ini dengan
                        peralatan terbaik dari Sewa-In.
                    </p>

                    <div class="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up"
                        style="animation-delay: 0.2s">
                        <a href="#"
                            class="group px-10 py-5 bg-white text-emerald-700 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center">
                            Mulai Sekarang
                            <svg class="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a href="#"
                            class="px-10 py-5 glass-effect text-white font-bold rounded-xl hover:bg-white hover:text-emerald-700 transition-all duration-300 text-center flex items-center justify-center">
                            <svg class="mr-2 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Hubungi Kami
                        </a>
                    </div>

                    <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div v-for="(item, index) in ctaStats" :key="index" class="text-center">
                            <div class="text-4xl font-black mb-2">{{ item.value }}</div>
                            <div class="text-sm text-gray-200">{{ item.label }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- WhatsApp Float Button -->
        <a href="https://wa.me/"
            class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group">
            <svg class="text-white w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span
                class="absolute right-full mr-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Chat dengan kami
            </span>
        </a>
    </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted, onUnmounted } from 'vue'

// Types
interface Stat {
    number: string
    label: string
}

interface ValueProp {
    iconType: 'heart' | 'bolt' | 'users'
    title: string
    description: string
    features: string[]
    gradient: string
    rotation: string
}

interface Category {
    id: string
    label: string
    icon: string
}

interface Equipment {
    id: number
    name: string
    category: string
    price: string
    description: string
    badge: string | null
    badgeColor: string
}

interface Step {
    iconType: 'search' | 'calendar' | 'truck'
    number: string
    title: string
    description: string
    gradient: string
}

interface Testimonial {
    name: string
    trip: string
    rating: number
    text: string
}

interface CTAStat {
    value: string
    label: string
}

// State
const activeCategory = ref<string>('all')

// Data
const stats: Stat[] = [
    { number: '25K+', label: 'Petualang Aktif' },
    { number: '500+', label: 'Peralatan Premium' },
    { number: '150+', label: 'Destinasi' },
    { number: '4.9', label: 'Rating Pengguna' }
]

const valueProps: ValueProp[] = [
    {
        iconType: 'heart',
        title: 'Kualitas Terjamin',
        description: 'Setiap peralatan dipilih dengan cermat, dirawat dengan standar profesional, dan diinspeksi sebelum setiap penyewaan.',
        features: ['Brand ternama internasional', 'Terawat optimal', 'Inspeksi rutin'],
        gradient: 'from-emerald-500 to-emerald-700',
        rotation: '-rotate-3'
    },
    {
        iconType: 'bolt',
        title: 'Fleksibilitas Total',
        description: 'Sewa sesuai kebutuhan Anda. Harian, mingguan, atau bulanan. Perpanjang dengan mudah jika petualangan berlanjut.',
        features: ['Booking instan', 'Perpanjang kapan saja', 'Cancel gratis H-2'],
        gradient: 'from-orange-500 to-orange-600',
        rotation: 'rotate-3'
    },
    {
        iconType: 'users',
        title: 'Komunitas Petualang',
        description: 'Bergabung dengan ribuan petualang. Bagikan pengalaman, dapatkan tips, dan temukan teman seperjalanan.',
        features: ['Forum diskusi aktif', 'Event komunitas', 'Panduan eksklusif'],
        gradient: 'from-emerald-500 to-emerald-700',
        rotation: '-rotate-3'
    }
]

const categories: Category[] = [
    { id: 'all', label: 'Semua Peralatan', icon: '🎒' },
    { id: 'camping', label: 'Camping', icon: '🏕️' },
    { id: 'hiking', label: 'Hiking', icon: '🥾' },
    { id: 'carrier', label: 'Carrier', icon: '🎒' },
    { id: 'gear', label: 'Perlengkapan', icon: '🔦' }
]

const equipment: Equipment[] = [
    {
        id: 1,
        name: 'Tenda Dome 4 Orang',
        category: 'camping',
        price: '75K',
        description: 'Waterproof, UV protection, mudah setup',
        badge: 'Populer',
        badgeColor: 'bg-emerald-600'
    },
    {
        id: 2,
        name: 'Carrier 60L + Raincover',
        category: 'carrier',
        price: '50K',
        description: 'Ergonomis, ventilasi punggung, banyak kompartemen',
        badge: 'New',
        badgeColor: 'bg-orange-600'
    },
    {
        id: 3,
        name: 'Sleeping Bag -5°C',
        category: 'camping',
        price: '40K',
        description: 'Hangat, compact, mummy design',
        badge: null,
        badgeColor: ''
    },
    {
        id: 4,
        name: 'Kompor Portable + Gas',
        category: 'gear',
        price: '25K',
        description: 'Efisien, windproof, safety lock',
        badge: null,
        badgeColor: ''
    }
]

const steps: Step[] = [
    {
        iconType: 'search',
        number: '01',
        title: 'Pilih Peralatan',
        description: 'Browse koleksi lengkap kami dan pilih peralatan yang sesuai dengan kebutuhan petualangan Anda.',
        gradient: 'from-emerald-500 to-emerald-700'
    },
    {
        iconType: 'calendar',
        number: '02',
        title: 'Booking Instan',
        description: 'Pilih tanggal, lakukan pembayaran aman, dan konfirmasi booking Anda dalam hitungan menit.',
        gradient: 'from-orange-500 to-orange-600'
    },
    {
        iconType: 'truck',
        number: '03',
        title: 'Siap Berangkat',
        description: 'Peralatan dikirim atau bisa diambil. Lengkap dengan panduan penggunaan dan dukungan 24/7.',
        gradient: 'from-emerald-500 to-emerald-700'
    }
]

const testimonials: Testimonial[] = [
    {
        name: 'Rizki Pratama',
        trip: 'Summit Rinjani • 3 trips',
        rating: 5,
        text: 'Gear yang disewa kualitasnya top banget! Carrier-nya ergonomis dan sleeping bag-nya bikin tidur nyenyak di ketinggian 3000 mdpl. Sewa-In bikin naik gunung jadi lebih gampang tanpa harus keluar budget besar buat beli gear.'
    },
    {
        name: 'Sarah Andini',
        trip: 'Beach Camping • 5 trips',
        rating: 5,
        text: 'Awalnya ragu sewa peralatan camping online, tapi ternyata prosesnya super mudah! Barang diantar tepat wakat, kondisi prima, dan customer servicenya responsif banget. Sekarang setiap weekend trip pasti pakai Sewa-In!'
    },
    {
        name: 'Andi Wijaya',
        trip: 'Jungle Trekking • 7 trips',
        rating: 5,
        text: 'Game changer buat yang suka adventure tapi belum punya budget lengkap. Sewa-In kasih akses ke gear berkualitas dengan harga terjangkau. Plus dapet tips dan panduan dari komunitasnya, jadi makin semangat eksplor Indonesia!'
    }
]

const ctaStats: CTAStat[] = [
    { value: '24/7', label: 'Customer Support' },
    { value: '100%', label: 'Uang Kembali' },
    { value: '2 Jam', label: 'Proses Booking' }
]



// Computed
const filteredEquipment = computed<Equipment[]>(() => {
    if (activeCategory.value === 'all') {
        return equipment
    }
    return equipment.filter(item => item.category === activeCategory.value)
})

// Intersection Observer for reveal animations
let observer: IntersectionObserver | null = null

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active')
                }
            })
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }
    )

    // Observe all elements with reveal class
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => {
        if (observer) {
            observer.observe(el)
        }
    })
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<style scoped>
@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
    animation: fadeIn 1s ease-out;
}

.animate-slide-up {
    animation: slideUp 1s ease-out;
    animation-fill-mode: both;
}

.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

.glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-background {
    background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);
    position: relative;
    overflow: hidden;
}

.hero-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
}
</style>