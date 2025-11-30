<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const astronautY = ref(0);
const astronautRotate = ref(0);
const time = ref(0);

const router = useRouter();

onMounted(() => {
  // Animasi floating astronaut
  setInterval(() => {
    time.value += 0.05;
    astronautY.value = Math.sin(time.value) * 20;
    astronautRotate.value = Math.sin(time.value * 0.5) * 5;
  }, 50);

  // Generate stars di dalam card
  const starsContainer = document.querySelector(".stars-container");
  if (starsContainer) {
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.className = "absolute bg-white rounded-full";
      const size = Math.random() * 2.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }
});

const goHome = () => {
  router.push({ name: "home" });
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <!-- SEKARANG: cuma 1 "card" / section di dalam AuthLayout -->
  <div
    class="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 shadow-2xl"
  >
    <!-- Stars Background -->
    <div class="stars-container absolute inset-0"></div>

    <!-- Floating Elements Background -->
    <div
      class="absolute top-6 left-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-10 right-6 w-28 h-28 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
      style="animation-delay: 1s"
    ></div>
    <div
      class="absolute top-1/2 left-1/4 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl animate-pulse"
      style="animation-delay: 2s"
    ></div>

    <!-- Main Content (disesuaikan biar muat di lebar auth layout) -->
    <div class="relative z-10 w-full">
      <div class="glass-effect rounded-2xl p-6 sm:p-8 md:p-10 border border-white/10">
        <div class="text-center space-y-8">
          <!-- Astronaut -->
          <div
            class="relative mx-auto"
            :style="{
              transform: `translateY(${astronautY}px) rotate(${astronautRotate}deg)`
            }"
          >
            <div class="w-40 h-40 sm:w-48 sm:h-48 mx-auto relative">
              <svg viewBox="0 0 220 220" class="w-full h-full drop-shadow-2xl">
                <defs>
                  <radialGradient id="helmetGradient" cx="50%" cy="30%">
                    <stop offset="0%" style="stop-color:#E0F2FE;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#BAE6FD;stop-opacity:0.8" />
                  </radialGradient>
                </defs>

                <!-- Helmet -->
                <circle cx="110" cy="85" r="48" fill="url(#helmetGradient)" opacity="0.95" />
                <circle cx="110" cy="85" r="43" fill="#BAE6FD" opacity="0.3" />
                <ellipse cx="95" cy="70" rx="15" ry="20" fill="#E0F2FE" opacity="0.5" />

                <!-- Face -->
                <circle cx="100" cy="80" r="4" fill="#1F2937" />
                <circle cx="120" cy="80" r="4" fill="#1F2937" />
                <path
                  d="M 100 90 Q 110 95 120 90"
                  stroke="#1F2937"
                  stroke-width="2.5"
                  fill="none"
                  stroke-linecap="round"
                />

                <!-- Body -->
                <rect x="80" y="128" width="60" height="55" rx="12" fill="#F3F4F6" />
                <rect x="85" y="133" width="50" height="45" rx="10" fill="#10B981" />

                <!-- Sewa-In Logo on chest -->
                <circle cx="110" cy="155" r="12" fill="#FFF" opacity="0.9" />
                <text
                  x="110"
                  y="160"
                  font-family="Arial"
                  font-size="10"
                  font-weight="bold"
                  fill="#10B981"
                  text-anchor="middle"
                >
                  S
                </text>

                <!-- Arms -->
                <rect
                  x="50"
                  y="138"
                  width="30"
                  height="18"
                  rx="9"
                  fill="#F3F4F6"
                  transform="rotate(-35 65 147)"
                />
                <rect
                  x="140"
                  y="138"
                  width="30"
                  height="18"
                  rx="9"
                  fill="#F3F4F6"
                  transform="rotate(35 155 147)"
                />

                <!-- Hands -->
                <circle cx="55" cy="155" r="8" fill="#FFF" />
                <circle cx="165" cy="155" r="8" fill="#FFF" />

                <!-- Legs -->
                <rect x="90" y="178" width="18" height="28" rx="9" fill="#F3F4F6" />
                <rect x="112" y="178" width="18" height="28" rx="9" fill="#F3F4F6" />

                <!-- Boots -->
                <ellipse cx="99" cy="206" rx="14" ry="7" fill="#1F2937" />
                <ellipse cx="121" cy="206" rx="14" ry="7" fill="#1F2937" />

                <!-- Antenna -->
                <line
                  x1="110"
                  y1="37"
                  x2="110"
                  y2="20"
                  stroke="#F59E0B"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <circle cx="110" cy="16" r="6" fill="#EF4444" opacity="0.9">
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="110" cy="16" r="6" fill="#EF4444" opacity="0.5">
                  <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            <!-- Floating lost items -->
            <div class="absolute -left-6 top-10 text-3xl sm:text-4xl animate-float opacity-70">
              🎒
            </div>
            <div class="absolute -right-6 top-16 text-2xl sm:text-3xl animate-float-delay opacity-70">
              🏕️
            </div>
            <div class="absolute left-2 bottom-6 text-2xl sm:text-3xl animate-float-slow opacity-70">
              📦
            </div>
            <div class="absolute right-6 bottom-10 text-xl sm:text-2xl animate-float opacity-70">
              🔦
            </div>
          </div>

          <!-- 404 Text -->
          <div>
            <div
              class="inline-block mb-4 px-4 py-2 glass-effect rounded-full text-xs sm:text-sm font-bold text-orange-300 border border-orange-400/30"
            >
              🚀 Houston, Kita Punya Masalah
            </div>

            <h1 class="text-6xl sm:text-7xl md:text-8xl font-black mb-2 tracking-tight">
              <span class="gradient-text-404">404</span>
            </h1>

            <div
              class="h-1.5 w-32 sm:w-40 bg-linear-to-r from-emerald-500 via-orange-500 to-emerald-500 mx-auto rounded-full"
            ></div>
          </div>

          <!-- Message -->
          <div class="space-y-3">
            <h2 class="text-2xl sm:text-3xl font-black text-white">
              Peralatan Tersesat di Luar Angkasa! 🌌
            </h2>
            <p
              class="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed"
            >
              Sepertinya halaman yang kamu cari sedang mengambang di orbit.
              Tapi tenang,
              <span class="text-orange-300 font-bold">
                gear petualangan
              </span>
              kamu masih aman di bumi!
            </p>
          </div>

          <!-- Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button
              @click="goHome"
              class="group relative px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <svg
                  class="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Kembali ke Base Camp
              </span>
              <div
                class="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              ></div>
            </button>

            <button
              @click="goBack"
              class="px-6 py-3 glass-effect text-white font-bold rounded-xl border-2 border-emerald-400/30 hover:border-emerald-400/60 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Jalur
            </button>
          </div>

          <!-- Info kecil -->
          <div class="glass-effect rounded-2xl p-4 border border-emerald-400/20">
            <div class="flex items-start gap-3 text-left">
              <div
                class="shrink-0 w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-bold text-sm mb-1">
                  💡 Tips Petualang
                </h3>
                <p class="text-emerald-100 text-xs leading-relaxed">
                  Halaman yang hilang seperti jalur pendakian yang belum
                  terpetakan. Tapi jangan khawatir,
                  <span class="text-orange-300 font-semibold">
                    25,000+ petualang
                  </span>
                  lainnya sudah menemukan jalan mereka di Sewa-In!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dekorasi besar hanya muncul kalau layout cukup lebar (tapi masih di dalam card) -->
    <!-- kalau mau lebih simpel, ini bisa dihapus -->
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(5deg);
  }
}

@keyframes float-delay {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(-5deg);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(3deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 7s ease-in-out infinite;
}

.glass-effect {
  background: rgba(16, 185, 129, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text-404 {
  background: linear-gradient(135deg, #10b981 0%, #f59e0b 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
