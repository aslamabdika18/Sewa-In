import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /**
     * Title yang nanti dipakai jadi document.title
     */
    title?: string;

    /**
     * Jenis layout yang dipakai route ini
     * - "default" → ada navbar & footer
     * - "auth" → halaman auth (tanpa navbar/footer)
     * - "admin" → layout admin (sidebar + topbar)
     */
    layout?: "default" | "auth" | "admin";

    /**
     * Kalau true → user wajib login
     */
    requiresAuth?: boolean;

    /**
     * Kalau true → hanya boleh diakses guest (belum login)
     * contoh: sign-in, sign-up
     */
    guestOnly?: boolean;

    /**
     * Role yang diizinkan (sinkron dengan enum UserRole di backend)
     * - "ADMIN"
     * - "USER"
     */
    role?: "ADMIN" | "USER";
  }
}
