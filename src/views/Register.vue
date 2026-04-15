<template>
  <form class="auth-card" @submit.prevent="onSubmit">
    <h1>Register</h1>
    <input v-model="form.username" placeholder="username" />
    <input v-model="form.login" placeholder="login" />
    <input v-model="form.password" type="password" placeholder="password" />
    <button>Create account</button>
    <p class="error" v-if="error">{{ error }}</p>
    <router-link to="/login">Back to login</router-link>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '../api/client';
import { authStore } from '../store/auth';

const router = useRouter();
const error = ref('');
const form = reactive({ username: '', login: '', password: '' });

async function onSubmit() {
  if (!form.username || !form.login || !form.password) {
    error.value = 'All fields are required';
    return;
  }
  try {
    const data = await apiClient.register(form);
    authStore.setUser({ userId: data.userId, username: data.username, login: data.login });
    router.push('/dashboard');
  } catch (e) {
    error.value = e.message || 'Registration failed';
  }
}
</script>
