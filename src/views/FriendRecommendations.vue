<template>
  <AppShell>
    <h1>Что подарить другу: {{ $route.params.login }}</h1>
    <div v-if="items.length" class="grid">
      <article class="card" v-for="rec in items" :key="`${rec.giftId}-${rec.reason}`">
        <h3>{{ rec.giftName }}</h3>
        <p>{{ rec.tagName }} · {{ rec.avgPrice }}</p>
        <p class="reason"><strong>Reason:</strong> {{ rec.reason }}</p>
      </article>
    </div>
    <p class="card" v-else>Рекомендации пока недоступны.</p>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const route = useRoute();
const items = ref([]);

onMounted(async () => {
  items.value = await apiClient.getFriendRecommendations(route.params.login);
});
</script>
