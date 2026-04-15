<template>
  <AppShell>
    <h1>Рекомендации по анкете #{{ $route.params.id }}</h1>
    <p v-if="fallback" class="card">Fallback mode: показаны универсальные варианты.</p>
    <div v-if="items.length" class="grid">
      <article class="card" v-for="rec in items" :key="`${rec.giftId}-${rec.reason}`">
        <h3>{{ rec.giftName }}</h3>
        <p>{{ rec.tagName }} · {{ rec.avgPrice }}</p>
        <p class="reason"><strong>Reason:</strong> {{ rec.reason }}</p>
      </article>
    </div>
    <p class="card" v-else>Рекомендаций нет.</p>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const route = useRoute();
const items = ref([]);
const fallback = computed(() => items.value.length && items.value.every((x) => /fallback|универс/i.test(x.reason)));

onMounted(async () => {
  items.value = await apiClient.getVictimRecommendations(route.params.id);
});
</script>
