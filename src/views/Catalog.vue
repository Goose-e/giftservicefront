<template>
  <AppShell>
    <h1 class="page-title">Catalog</h1>
    <p class="page-subtitle">Поиск и добавление подарков в wishlist</p>

    <div class="catalog-actions">
      <div class="search-wrap">
        <input v-model="search" placeholder="Search by gift or tag" />
        <span class="search-icon">🔍</span>
      </div>
      <button class="btn create-btn" @click="createGift">Create gift</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="card-grid">
      <article class="card gift-card" v-for="gift in filtered" :key="gift.giftId">
        <div class="gift-emoji">{{ giftEmoji(gift.tagName) }}</div>
        <h3>{{ gift.giftName }}</h3>
        <p class="gift-price">Avg price: {{ gift.avgPrice }}</p>
        <div class="gift-actions">
          <span class="btn-chip chip-tag">{{ gift.tagName }}</span>
          <button class="btn btn-wishlist" @click="addToWishlist(gift.giftId)">В wishlist</button>
        </div>
      </article>
    </section>

    <p v-if="!filtered.length" class="panel">Подарков пока нет. Добавьте первый 🎁</p>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const gifts = ref([]);
const search = ref('');
const error = ref('');
const form = reactive({ giftName: '', giftAvgPrice: 0, tagName: '' });

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();
  return gifts.value.filter((g) => `${g.giftName ?? ''} ${g.tagName ?? ''}`.toLowerCase().includes(query));
});

const giftEmoji = (tag) => {
  const value = (tag ?? '').toLowerCase();
  if (value.includes('music')) return '🎧';
  if (value.includes('book')) return '📚';
  if (value.includes('game')) return '🎮';
  if (value.includes('tech')) return '🔊';
  return '🎁';
};

async function load() {
  try {
    const res = await apiClient.getCatalog();
    gifts.value = res?.gifts ?? [];
  } catch (e) {
    error.value = 'Ошибка загрузки каталога';
  }
}

async function createGift() {
  const nextName = `Gift ${gifts.value.length + 1}`;
  const fallbackTag = ['music', 'books', 'gaming'][gifts.value.length % 3];
  form.giftName = form.giftName || nextName;
  form.giftAvgPrice = form.giftAvgPrice > 0 ? form.giftAvgPrice : 50;
  form.tagName = form.tagName || fallbackTag;

  try {
    error.value = '';
    await apiClient.createCatalogGift({
      giftName: form.giftName,
      giftAvgPrice: Number(form.giftAvgPrice),
      tagName: form.tagName,
    });
    form.giftName = '';
    form.giftAvgPrice = 0;
    form.tagName = '';
    await load();
  } catch (e) {
    error.value = 'Ошибка создания подарка';
  }
}

async function addToWishlist(giftId) {
  await apiClient.addToWishlist(giftId);
}

onMounted(load);
</script>

<style scoped>
.catalog-actions {
  display: flex;
  gap: 18px;
  margin-bottom: 32px;
}

.search-wrap {
  position: relative;
  width: min(700px, 100%);
}

.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.create-btn {
  background: #6d28d9;
  min-width: 240px;
}

.gift-card h3 {
  font-size: 36px;
  margin: 12px 0;
}

.gift-emoji {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ebe7fa;
  display: grid;
  place-items: center;
  font-size: 44px;
  margin: 0 auto;
}

.gift-price {
  font-size: 24px;
  color: #6b7280;
}

.gift-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.chip-tag {
  color: #6d28d9;
  background: #e9e2ff;
}

.btn-wishlist {
  background: #ec4899;
}
</style>
