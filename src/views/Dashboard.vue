<template>
  <AppShell>
    <h1>Dashboard</h1>
    <p>Быстрые действия</p>
    <div class="grid">
      <router-link class="card" to="/catalog">Каталог подарков</router-link>
      <router-link class="card" to="/wishlist">Мой wishlist</router-link>
      <router-link class="card" to="/friends">Друзья</router-link>
      <router-link class="card" to="/victims">Анкеты получателей</router-link>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue';
</script>
