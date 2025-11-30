import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // 🌿 Public pages (default layout)
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
    path: "/barang",
    name: "BarangList",
    component: () => import("@/pages/BarangList.vue"),
    meta: {
      title: "Katalog Barang",
      layout: "default"
    }
  },
  {
    path: "/barang/:id",
    name: "BarangDetail",
    component: () => import("@/pages/BarangDetail.vue"),
    meta: {
      title: "Detail Barang",
      layout: "default"
    }
  },

  // 🔧 Contoh halaman yang butuh login tapi tetap layout default
  {
    path: "/tools",
    name: "tools",
    component: () => import("@/pages/Tools.vue"),
    meta: {
      title: "Peralatan",
      layout: "default",
      requiresAuth: true
    }
  },

  // 🔐 ADMIN AREA (layout: admin, role: ADMIN)
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import("@/pages/AdminDashboard.vue"),
    meta: {
      title: "Admin Dashboard",
      layout: "admin",
      requiresAuth: true,
      role: "ADMIN"
    }
  },
  {
    path: "/admin/orders",
    name: "AdminOrders",
    // TODO: nanti ganti ke AdminOrdersPage.vue kalau sudah ada
    component: () => import("@/pages/AdminDashboard.vue"),
    meta: {
      title: "Pesanan",
      layout: "admin",
      requiresAuth: true,
      role: "ADMIN"
    }
  },
  {
    path: "/admin/barang",
    name: "AdminBarang",
    // TODO: nanti ganti ke AdminBarangPage.vue kalau sudah ada
    component: () => import("@/pages/AdminDashboard.vue"),
    meta: {
      title: "Katalog Barang (Admin)",
      layout: "admin",
      requiresAuth: true,
      role: "ADMIN"
    }
  },
  {
    path: "/admin/customers",
    name: "AdminCustomers",
    // TODO: nanti ganti ke AdminCustomersPage.vue kalau sudah ada
    component: () => import("@/pages/AdminDashboard.vue"),
    meta: {
      title: "Customer",
      layout: "admin",
      requiresAuth: true,
      role: "ADMIN"
    }
  },

  // 🔑 Auth pages (layout: auth, guestOnly)
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/pages/SignIn.vue"),
    meta: {
      title: "Masuk",
      layout: "auth",
      guestOnly: true
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

  // 404
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
