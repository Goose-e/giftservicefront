<template>
  <div class="app">
    <aside class="sidebar">
      <h2>GiftServiceAuth</h2>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/catalog">Catalog</router-link>
      <router-link to="/wishlist">Wishlist</router-link>
      <router-link to="/friends">Friends</router-link>
      <router-link to="/victims">Victims</router-link>
    </aside>
    <main class="main">
      <div class="row" style="justify-content:flex-end; margin-bottom: 10px;">
        <span v-if="authStore.state.user">{{ authStore.state.user.username }} (@{{ authStore.state.user.login }})</span>
        <button class="secondary" @click="onLogout">Logout</button>
      </div>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { authStore } from '../store/auth';

const router = useRouter();

function onLogout() {
  authStore.clear();
  router.push('/login');
}
</script>
