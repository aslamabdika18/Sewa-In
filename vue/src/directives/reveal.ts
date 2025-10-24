import type { Directive } from 'vue'

export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  },
}
