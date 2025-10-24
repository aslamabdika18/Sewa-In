import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/routers'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { vReveal } from '@/directives/reveal'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.directive('reveal', vReveal)

const toastOptions: ToastContainerOptions = {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored'
}

app.use(Vue3Toastify, toastOptions)
app.mount('#app')
