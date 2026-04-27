<template>
  <div class="layout" :class="theme.pageClass">
    <header class="topbar" :class="theme.headerClass">
      <div class="brand">
        <span class="brand-icon">{{ theme.icon }}</span>
        <span class="brand-text">Gift Service</span>
      </div>

      <nav class="nav-links">
        <router-link to="/catalog">Catalog</router-link>
        <router-link to="/wishlist">Wishlist</router-link>
        <router-link to="/friends">Friends</router-link>
        <router-link to="/victims">Victims</router-link>
      </nav>

      <button class="logout-btn" @click="onLogout">Logout</button>
    </header>

    <main class="page-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '../store/auth';

const router = useRouter();
const route = useRoute();

const themeMap = [
  { test: (path) => path.startsWith('/catalog'), icon: '🎁', headerClass: 'theme-catalog', pageClass: 'bg-catalog' },
  { test: (path) => path.startsWith('/wishlist'), icon: '💝', headerClass: 'theme-wishlist', pageClass: 'bg-wishlist' },
  { test: (path) => path.startsWith('/friends'), icon: '👥', headerClass: 'theme-friends', pageClass: 'bg-friends' },
  { test: (path) => path.startsWith('/victims/'), icon: '✨', headerClass: 'theme-recommendations', pageClass: 'bg-recommendations' },
  { test: (path) => path.startsWith('/victims'), icon: '📝', headerClass: 'theme-victims', pageClass: 'bg-victims' },
];

const theme = computed(() => {
  const found = themeMap.find((item) => item.test(route.path));
  return found ?? { icon: '🎁', headerClass: 'theme-catalog', pageClass: 'bg-catalog' };
});

function onLogout() {
  authStore.clear();
  router.push('/login');
}
</script>
