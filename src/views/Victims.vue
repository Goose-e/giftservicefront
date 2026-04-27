<template>
  <AppShell>
    <h1 class="page-title">Анкеты получателей</h1>
    <p class="page-subtitle">Создание анкет и подбор подарков по интересам</p>

    <div class="victim-layout">
      <form class="panel victim-form" @submit.prevent="create">
        <h2>Создание анкеты</h2>
        <div class="form-grid">
          <input v-model="form.gender" placeholder="gender" />
          <input v-model="form.birthdate" type="datetime-local" />
          <input v-model="form.country" placeholder="country" />
          <input v-model="form.city" placeholder="city" />
          <textarea class="full" v-model="form.info" placeholder="info" />
        </div>
        <button class="btn create-btn">Создать анкету</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>

      <section class="victim-list">
        <article class="panel victim-card" v-for="victim in items" :key="victim.victimId">
          <div class="avatar">{{ victimEmoji(victim.info) }}</div>
          <div>
            <h3>{{ victim.gender }} · {{ victim.city }}</h3>
            <p>{{ victim.country }} · {{ victim.info }}</p>
            <router-link class="open-link" :to="`/victims/${victim.victimId}/recommendations`">Открыть рекомендации →</router-link>
          </div>
        </article>
        <p v-if="!items.length" class="panel">Анкет пока нет.</p>
      </section>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const items = ref([]);
const error = ref('');
const form = reactive({ gender: '', birthdate: '', country: '', city: '', info: '' });

const victimEmoji = (info) => (/муз|music/i.test(info ?? '') ? '🎵' : /игр|game|tech/i.test(info ?? '') ? '🎮' : '📝');

const load = async () => {
  const res = await apiClient.getVictims();
  items.value = res?.victims ?? [];
};

async function create() {
  if (!form.gender || !form.birthdate || !form.country || !form.city) {
    error.value = 'Заполните обязательные поля';
    return;
  }

  error.value = '';

  await apiClient.createVictim({
    gender: form.gender,
    birthdate: form.birthdate,
    country: form.country,
    city: form.city,
    info: form.info,
  });

  form.gender = '';
  form.birthdate = '';
  form.country = '';
  form.city = '';
  form.info = '';

  await load();
}

onMounted(load);
</script>

<style scoped>
.victim-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
}

.victim-form h2 {
  margin-top: 0;
  font-size: 48px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.full {
  grid-column: 1 / -1;
}

.create-btn {
  margin-top: 14px;
  background: #16a34a;
  width: min(420px, 100%);
}

.victim-list {
  display: grid;
  gap: 20px;
  align-content: start;
}

.victim-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.victim-card h3 {
  font-size: 46px;
  margin: 0 0 8px;
}

.victim-card p {
  margin: 0;
  color: #6b7280;
  font-size: 30px;
}

.avatar {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  background: #bde7d1;
  display: grid;
  place-items: center;
  font-size: 46px;
}

.open-link {
  display: inline-block;
  margin-top: 12px;
  color: #047857;
  font-size: 30px;
}

@media (max-width: 1200px) {
  .victim-layout {
    grid-template-columns: 1fr;
  }
}
</style>
