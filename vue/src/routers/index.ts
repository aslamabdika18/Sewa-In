import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/routers/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
router.beforeEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Sewa-In`
    : 'Sewa-In'
})

export default router
