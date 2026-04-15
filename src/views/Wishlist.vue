<template>
  <AppShell>
    <h1>My wishlist</h1>
    <div class="grid" v-if="items.length">
      <article class="card" v-for="gift in items" :key="gift.giftId">
        <h3>{{ gift.giftName }}</h3>
        <p>{{ gift.tagName }} · {{ gift.avgPrice }}</p>
        <button @click="removeGift(gift.giftId)">Удалить</button>
      </article>
    </div>
    <div class="card" v-else>
      <p>Wishlist пуст.</p>
      <router-link to="/catalog">Перейти в каталог</router-link>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const items = ref([]);
const load = async () => { items.value = await apiClient.getMyWishlist(); };
const removeGift = async (giftId) => { await apiClient.removeFromWishlist(giftId); await load(); };
onMounted(load);
</script>
