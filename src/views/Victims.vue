<template>
  <AppShell>
    <h1>Анкеты получателей</h1>
    <form class="card" @submit.prevent="create">
      <input v-model="form.gender" placeholder="gender" />
      <input v-model="form.birthdate" type="datetime-local" />
      <input v-model="form.country" placeholder="country" />
      <input v-model="form.city" placeholder="city" />
      <textarea v-model="form.info" placeholder="info" />
      <button>Создать анкету</button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>

    <div v-if="items.length" class="grid">
      <article class="card" v-for="victim in items" :key="victim.victimId">
        <h3>{{ victim.gender }} · {{ victim.city }}</h3>
        <p>{{ victim.country }}</p>
        <p>{{ victim.info }}</p>
        <router-link :to="`/victims/${victim.victimId}/recommendations`">Открыть рекомендации</router-link>
      </article>
    </div>
    <p v-else class="card">Анкет пока нет.</p>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';

const items = ref([]);
const error = ref('');
const form = reactive({ gender: '', birthdate: '', country: '', city: '', info: '' });

const load = async () => { items.value = await apiClient.getVictims(); };

async function create() {
  if (!form.gender || !form.birthdate || !form.country || !form.city) {
    error.value = 'Заполните обязательные поля';
    return;
  }
  error.value = '';
  await apiClient.createVictim(form);
  await load();
}

onMounted(load);
</script>
