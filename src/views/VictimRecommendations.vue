<template>
  <AppShell>
    <h1 class="page-title">Рекомендации по анкете #{{ $route.params.id }}</h1>
    <p class="page-subtitle">Персональные идеи подарков на основе анкеты получателя</p>

    <p v-if="error" class="panel error">{{ error }}</p>
    <p v-else-if="fallback" class="panel">Fallback mode: показаны универсальные варианты.</p>

    <section class="card-grid" v-if="items.length">
      <article class="card rec-card" v-for="rec in items" :key="`${rec.giftId}-${rec.reason}`">
        <div class="rec-emoji">{{ tagIcon(rec.tagName) }}</div>
        <h3>{{ rec.giftName }}</h3>
        <span class="btn-chip rec-tag">{{ rec.tagName || 'AI suggestion' }}</span>
        <p class="reason-title">Reason:</p>
        <p class="reason-text">{{ rec.reason }}</p>
      </article>
    </section>

    <p class="panel" v-else-if="!error">Рекомендаций нет.</p>
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

const tagIcon = (tagName) => {
  const value = (tagName ?? '').toLowerCase();
  if (value.includes('music')) return '🎧';
  if (value.includes('game')) return '🎮';
  if (value.includes('tech')) return '🔊';
  return '🎁';
};

const fallback = computed(() => items.value.length > 0 && items.value.every((x) => /fallback|универс/i.test(x.reason ?? '')));

onMounted(async () => {
  try {
    const res = await apiClient.getVictimRecommendations(route.params.id);
    items.value = res?.recommendations ?? [];
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки рекомендаций';
  }
});
</script>

<style scoped>
.rec-card h3 {
  font-size: 45px;
  margin: 14px 0;
}

.rec-emoji {
  width: 136px;
  height: 136px;
  border-radius: 50%;
  background: #d8e4f5;
  display: grid;
  place-items: center;
  margin: 0 auto;
  font-size: 62px;
}

.rec-tag {
  background: #d8def0;
  color: #3730a3;
}

.reason-title {
  margin: 18px 0 8px;
  font-weight: 800;
  font-size: 34px;
}

.reason-text {
  margin: 0;
  font-size: 34px;
  color: #6b7280;
}
</style>
