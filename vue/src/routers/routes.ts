import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: { 
      title: 'Beranda',
      layout: 'default' // 👈 Ada Navbar & Footer
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutUs.vue'),
    meta: { 
      title: 'Tentang Kami',
      layout: 'default' // 👈 Ada Navbar & Footer
    }
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/pages/Tools.vue'),
    meta: { 
      title: 'Peralatan',
      layout: 'default' // 👈 Ada Navbar & Footer
    }
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/pages/SignIn.vue'),
    meta: { 
      title: 'Masuk',
      layout: 'auth' // 👈 TIDAK ADA Navbar & Footer
    }
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('@/pages/SignUp.vue'),
    meta: { 
      title: 'Daftar',
      layout: 'auth' // 👈 TIDAK ADA Navbar & Footer
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
    meta: { 
      title: 'Halaman Tidak Ditemukan',
      layout: 'auth' // 👈 Ada Navbar & Footer
    }
  }
]

export default routes