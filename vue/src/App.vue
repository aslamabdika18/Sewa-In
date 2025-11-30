<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

// Layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const route = useRoute();

// Tentukan layout berdasarkan meta.layout
const layoutComponent = computed(() => {
  const layout = route.meta.layout;

  if (layout === "auth") return AuthLayout;
  if (layout === "admin") return AdminLayout;

  // default layout = layout publik
  return DefaultLayout;
});
</script>
