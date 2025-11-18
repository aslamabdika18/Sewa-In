# Sewa-In Vue Frontend

## Project Structure

\`\`\`markdown
src/
 ├── App.vue
 ├── main.ts
 ├── env.d.ts
 ├── style.css
 ├── assets/
 ├── components/
 │     ├── Footer.vue
 │     ├── Navbar.vue
 │     └── catalog/
 │           ├── MobileFilterDrawer.vue
 │           ├── Pagination.vue
 │           ├── ProductCard.vue
 │           └── ProductListItem.vue
 ├── config/
 ├── directives/
 │     └── reveal.ts
 ├── pages/
 │     ├── AboutUs.vue
 │     ├── Home.vue
 │     ├── NotFound.vue
 │     ├── SignIn.vue
 │     ├── SignUp.vue
 │     └── Tools.vue
 ├── routers/
 │     ├── index.ts
 │     └── routes.ts
 ├── services/
 │     └── api.ts
 └── stores/
\`\`\`

## Dependencies

- **vue**: ^3.5.22 - Progressive JavaScript framework
- **vue-router**: ^4.6.3 - Official router for Vue.js
- **pinia**: ^3.0.3 - State management
- **axios**: ^1.13.2 - HTTP client
- **tailwindcss**: ^4.1.14 - Utility-first CSS framework
- **@tailwindcss/vite**: ^4.1.14 - Vite plugin for Tailwind CSS
- **@heroicons/vue**: ^2.2.0 - SVG icons by Tailwind Labs
- **@iconify/vue**: ^5.0.0 - Icon framework
- **@vueuse/core**: ^13.9.0 - Vue Composition Utilities
- **vue3-toastify**: ^0.2.8 - Toast notification library

## Dev Dependencies

- **vite**: ^7.1.7 - Next generation frontend tooling
- **vue-tsc**: ^3.1.0 - TypeScript type checking for Vue
- **typescript**: ~5.9.3 - TypeScript language
- **@vitejs/plugin-vue**: ^6.0.1 - Vite plugin for Vue SFC
- **@vue/tsconfig**: ^0.8.1 - TypeScript config for Vue
- **@types/node**: ^24.6.0 - Node.js type definitions

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
