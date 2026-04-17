<template>
  <AppShell>
    <h1>Wishlist друга: {{ $route.params.login }}</h1>
    <div v-if="error" class="card">
      <p class="error">Ошибка доступа к wishlist друга.</p>
      <router-link to="/friends">Назад к друзьям</router-link>
    </div>
    <div v-else-if="items.length" class="grid">
      <article class="card" v-for="gift in items" :key="gift.giftId">
        <h3>{{ gift.giftName }}</h3>
        <p>{{ gift.tagName }} · {{ gift.avgPrice }}</p>
      </article>
    </div>
    <p v-else class="card">У друга пока пустой wishlist.</p>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const route = useRoute();
const items = ref([]);
const error = ref(false);

onMounted(async () => {
  try {
    const res = await apiClient.getFriendWishlist(route.params.login);
    console.log('friend wishlist:', res);
    items.value = res?.gifts ?? [];
  } catch (e) {
    console.error(e);
    error.value = true;
  }
});
</script>
