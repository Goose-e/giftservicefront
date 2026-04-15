<template>
  <AppShell>
    <h1>Catalog</h1>
    <input v-model="search" placeholder="Search by gift or tag" />
    <form class="card" @submit.prevent="createGift">
      <h3>Add gift</h3>
      <input v-model="form.giftName" placeholder="giftName" />
      <input v-model.number="form.giftAvgPrice" min="0" type="number" placeholder="giftAvgPrice" />
      <input v-model="form.tagName" placeholder="tagName" />
      <button>Create</button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>
    <div class="grid" v-if="filtered.length">
      <article class="card" v-for="gift in filtered" :key="gift.giftId">
        <h3>{{ gift.giftName }}</h3>
        <p>Avg price: {{ gift.avgPrice }}</p>
        <p>Tag: {{ gift.tagName }}</p>
        <button @click="addToWishlist(gift.giftId)">В wishlist</button>
      </article>
    </div>
    <p v-else class="card">Пусто. Добавьте подарок.</p>
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

const filtered = computed(() => gifts.value.filter((g) => `${g.giftName} ${g.tagName}`.toLowerCase().includes(search.value.toLowerCase())));

async function load() { gifts.value = await apiClient.getCatalog(); }

async function createGift() {
  if (!form.giftName || !form.tagName || form.giftAvgPrice < 0) {
    error.value = 'giftName/tagName required, price >=0';
    return;
  }
  error.value = '';
  await apiClient.createCatalogGift(form);
  await load();
}

async function addToWishlist(giftId) {
  await apiClient.addToWishlist(giftId);
}

onMounted(load);
</script>
