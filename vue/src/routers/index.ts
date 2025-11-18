import { createRouter, createWebHistory } from "vue-router";
import routes from "@/routers/routes";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
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

  // 🧱 2. Panggil /auth/me cuma SEKALI di awal
  if (!authStore.isInitialized) {
    await authStore.loadCurrentUser();
  }

  const requiresAuth = to.meta.requiresAuth === true;
  const guestOnly = to.meta.guestOnly === true;
  const isLoggedIn = authStore.user !== null;

  // 🧱 3. Route yang butuh login, tapi user belum login → redirect ke sign-in
  if (requiresAuth && !isLoggedIn) {
    return {
      name: "sign-in",
      query: { redirect: to.fullPath }
    };
  }

  // 🧱 4. Route khusus guest (sign-in / sign-up), tapi user sudah login → ke home
  if (guestOnly && isLoggedIn) {
    return { name: "home" };
  }

  // 🧱 5. Lanjutkan navigasi
  return true;
});

export default router;
