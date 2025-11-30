import { createRouter, createWebHistory } from "vue-router";
import routes from "@/routers/routes";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Untuk halaman non-admin, scroll ke atas.
    // Di layout admin, yang di-scroll hanya main content via CSS.
    return { top: 0 };
  }
});

router.beforeEach(async (to) => {
  // 🧱 1. Set document title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Sewa-In`;
  } else {
    document.title = "Sewa-In";
  }

  const authStore = useAuthStore();

  // 🧱 2. Pastikan /me hanya dipanggil sekali di awal
  // loadCurrentUser() sendiri SUDAH cek isInitialized, jadi double-safe
  if (!authStore.isInitialized) {
    await authStore.loadCurrentUser();
  }

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const guestOnly = Boolean(to.meta.guestOnly);
  const isLoggedIn = authStore.user !== null;

  // 🧱 3. Role yang dibutuhkan (optional, sesuai deklarasi RouteMeta)
  const requiredRole = to.meta.role; // "ADMIN" | "USER" | undefined
  const userRole = authStore.user?.role; // "ADMIN" | "USER" | undefined

  // 🧱 4. Route yang butuh login, tapi user belum login → redirect ke sign-in
  if (requiresAuth && !isLoggedIn) {
    return {
      name: "sign-in",
      query: { redirect: to.fullPath }
    };
  }

  // 🧱 5. Route khusus guest (sign-in / sign-up), tapi user sudah login → ke home
  if (guestOnly && isLoggedIn) {
    return { name: "home" };
  }

  // 🧱 6. Route yang butuh role tertentu (contoh: ADMIN)
  if (requiredRole && isLoggedIn) {
    if (userRole !== requiredRole) {
      console.warn(
        `❌ Access denied: User role ${userRole} != required role ${requiredRole}`
      );
      return { name: "home" };
    }
  }

  // 🧱 7. Lanjutkan navigasi
  return true;
});

export default router;
