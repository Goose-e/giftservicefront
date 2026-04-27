<template>
  <AppShell>
    <h1>Рекомендации по анкете #{{ $route.params.id }}</h1>

    <p v-if="error" class="card error">{{ error }}</p>
    <p v-else-if="fallback" class="card">
      Fallback mode: показаны универсальные варианты.
    </p>

    <div v-if="items.length" class="grid">
      <article class="card" v-for="rec in items" :key="`${rec.giftId}-${rec.reason}`">
        <h3>{{ rec.giftName }}</h3>
        <p>{{ rec.tagName || 'AI suggestion' }} · {{ rec.avgPrice }}</p>
        <p class="reason"><strong>Reason:</strong> {{ rec.reason }}</p>
      </article>
    </div>

    <p class="card" v-else-if="!error">Рекомендаций нет.</p>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const route = useRoute();
const items = ref([]);
const error = ref('');

const fallback = computed(() =>
    items.value.length > 0 &&
    items.value.every((x) => /fallback|универс/i.test(x.reason ?? ''))
);

onMounted(async () => {
  try {
    const res = await apiClient.getVictimRecommendations(route.params.id);
    console.log('recommendations response:', res);

    items.value = res?.recommendations ?? [];

    console.log('items:', items.value);
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Ошибка загрузки рекомендаций';
  }
});
</script>
