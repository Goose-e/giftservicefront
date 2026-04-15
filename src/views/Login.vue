<template>
  <form class="auth-card" @submit.prevent="onSubmit">
    <h1>Login</h1>
    <input v-model="form.login" placeholder="login" />
    <input v-model="form.password" type="password" placeholder="password" />
    <button>Sign in</button>
    <p class="error" v-if="error">{{ error }}</p>
    <router-link to="/register">Create account</router-link>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '../api/client';
import { authStore } from '../store/auth';

const router = useRouter();
const error = ref('');
const form = reactive({ login: '', password: '' });

async function onSubmit() {
  try {
    const data = await apiClient.login(form);
    authStore.setUser({ userId: data.userId, username: data.username, login: data.login });
    router.push('/dashboard');
  } catch (e) {
    error.value = e.message || 'Login failed';
  }
}
</script>
