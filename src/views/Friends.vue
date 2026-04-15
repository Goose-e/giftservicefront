<template>
  <AppShell>
    <h1>Friends</h1>
    <div class="row">
      <input v-model="usernameQuery" placeholder="Search by username" />
      <button @click="search">Search</button>
    </div>

    <h3>Search results</h3>
    <div class="grid">
      <article class="card" v-for="user in searchResults" :key="user.login">
        <h4>{{ user.username }} (@{{ user.login }})</h4>
        <button v-if="canAdd(user)" @click="add(user.login)">Добавить</button>
      </article>
    </div>

    <h3>My friends</h3>
    <div class="grid" v-if="friends.length">
      <article class="card" v-for="friend in friends" :key="friend.login">
        <h4>{{ friend.username }} (@{{ friend.login }})</h4>
        <div class="row">
          <router-link :to="`/friends/${friend.login}/wishlist`">Wishlist</router-link>
          <router-link :to="`/friends/${friend.login}/recommendations`">Recommendations</router-link>
          <button class="secondary" @click="remove(friend.login)">Удалить</button>
        </div>
      </article>
    </div>
    <p class="card" v-else>Список друзей пуст</p>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppShell from '../components/AppShell.vue';
import { apiClient } from '../api/client';
import { authStore } from '../store/auth';

const friends = ref([]);
const searchResults = ref([]);
const usernameQuery = ref('');

const load = async () => { friends.value = await apiClient.getFriends(); };
const search = async () => { searchResults.value = await apiClient.searchFriends(usernameQuery.value); };
const add = async (login) => { await apiClient.addFriend(login); await load(); };
const remove = async (login) => { await apiClient.removeFriend(login); await load(); };
const canAdd = (user) => user.login !== authStore.state.user?.login && !friends.value.some((f) => f.login === user.login);

onMounted(load);
</script>
