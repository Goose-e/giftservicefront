<template>
  <AppShell>
    <h1 class="page-title">My wishlist</h1>
    <p class="page-subtitle">Список подарков, которые пользователь хочет сохранить</p>

    <section class="card-grid">
      <article class="card wish-card" v-for="gift in items" :key="gift.giftId">
        <div class="wish-emoji">{{ giftEmoji(gift.tagName) }}</div>
        <h3>{{ gift.giftName }}</h3>
        <p class="wish-meta">{{ gift.tagName }} · {{ gift.avgPrice }}</p>
        <button class="btn remove-btn" @click="removeGift(gift.giftId)">Удалить</button>
      </article>

      <router-link v-if="items.length" class="card add-more" to="/catalog">
        <div class="wish-emoji">➕</div>
        <h3>Добавить ещё</h3>
        <p>Перейти в каталог</p>
      </router-link>
    </section>

    <router-link v-if="!items.length" class="panel add-empty" to="/catalog">
      Wishlist пуст. Перейти в каталог.
    </router-link>
  </AppShell>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const items = ref([]);

const giftEmoji = (tag) => {
  const value = (tag ?? '').toLowerCase();
  if (value.includes('music')) return '🎧';
  if (value.includes('book')) return '📚';
  if (value.includes('game')) return '🎮';
  return '🎁';
};

const load = async () => {
  const res = await apiClient.getMyWishlist();
  items.value = res?.gifts ?? [];
};

const removeGift = async (giftId) => {
  await apiClient.removeFromWishlist(giftId);
  await load();
};

onMounted(load);
</script>

<style scoped>
.wish-card h3 {
  font-size: 45px;
  margin: 14px 0;
}

.wish-emoji {
  width: 136px;
  height: 136px;
  border-radius: 50%;
  background: #f0e4d4;
  display: grid;
  place-items: center;
  font-size: 62px;
  margin: 0 auto;
}

.wish-meta {
  color: #6b7280;
  font-size: 34px;
}

.remove-btn {
  width: 100%;
  margin-top: 20px;
  background: #ef4444;
}

.add-more {
  text-align: center;
  color: #1f2937;
}

.add-more p {
  color: #6b7280;
}

.add-empty {
  display: inline-block;
  font-size: 28px;
}
</style>
