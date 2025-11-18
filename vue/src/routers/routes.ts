import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "Beranda",
      layout: "default"
    }
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/AboutUs.vue"),
    meta: {
      title: "Tentang Kami",
      layout: "default"
    }
  },
  {
    path: "/tools",
    name: "tools",
    component: () => import("@/pages/Tools.vue"),
    meta: {
      title: "Peralatan",
      layout: "default",
      requiresAuth: true, // 👈 contoh route yang butuh login
    }
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/pages/SignIn.vue"),
    meta: {
      title: "Masuk",
      layout: "auth",
      guestOnly: true // 👈 jangan boleh masuk kalau sudah login
    }
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("@/pages/SignUp.vue"),
    meta: {
      title: "Daftar",
      layout: "auth",
      guestOnly: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFound.vue"),
    meta: {
      title: "Halaman Tidak Ditemukan",
      layout: "auth"
    }
  }
];

export default routes;
