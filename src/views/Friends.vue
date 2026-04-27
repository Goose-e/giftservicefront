<template>
  <AppShell>
    <h1 class="page-title">Friends</h1>
    <p class="page-subtitle">Поиск пользователей и просмотр wishlist друзей</p>

    <div class="search-row">
      <input v-model="usernameQuery" placeholder="Search by username" />
      <button class="btn search-btn" @click="search">Search</button>
    </div>

    <h2 class="section-title">Search results</h2>
    <div class="card-grid compact-grid">
      <article class="card result-card" v-for="user in searchResults" :key="user.login">
        <div class="avatar">👤</div>
        <div>
          <h4>{{ user.username }}</h4>
          <p>@{{ user.login }}</p>
          <button class="btn add-btn" v-if="canAdd(user)" @click="add(user.login)">Добавить</button>
        </div>
      </article>
    </div>

    <h2 class="section-title">My friends</h2>
    <div class="card-grid">
      <article class="card friend-card" v-for="friend in friends" :key="friend.login">
        <div class="avatar large">🙂</div>
        <div class="friend-info">
          <h4>{{ friend.username }} (@{{ friend.login }})</h4>
          <div class="friend-actions">
            <router-link class="btn action-btn" :to="`/friends/${friend.login}/wishlist`">Wishlist</router-link>
            <router-link class="btn action-btn alt" :to="`/friends/${friend.login}/recommendations`">Recommendations</router-link>
            <button class="btn delete-btn" @click="remove(friend.login)">Удалить</button>
          </div>
        </div>
      </article>
    </div>

    <p class="panel" v-if="!friends.length">Список друзей пуст</p>
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

const load = async () => {
  const res = await apiClient.getFriends();
  friends.value = res.friends ?? [];
};

const search = async () => {
  const res = await apiClient.searchFriends(usernameQuery.value);
  searchResults.value = res.friends ?? [];
};

const add = async (login) => {
  await apiClient.addFriend(login);
  await load();
};

const remove = async (login) => {
  await apiClient.removeFriend(login);
  await load();
};

const canAdd = (user) =>
  user.login !== authStore.state.user?.login && !friends.value.some((f) => f.login === user.login);

onMounted(load);
</script>

<style scoped>
.search-row {
  display: flex;
  gap: 18px;
  max-width: 900px;
}

.search-btn {
  background: #0891b2;
  min-width: 200px;
}

.section-title {
  font-size: 40px;
  margin: 40px 0 22px;
}

.compact-grid {
  grid-template-columns: repeat(auto-fit, minmax(360px, 420px));
}

.result-card,
.friend-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.result-card h4,
.friend-card h4 {
  font-size: 32px;
  margin: 0;
}

.result-card p {
  margin: 8px 0;
  color: #6b7280;
  font-size: 22px;
}

.avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 34px;
  background: #cceef5;
}

.avatar.large {
  width: 88px;
  height: 88px;
  background: #e2e8ff;
}

.add-btn {
  background: #06b6d4;
}

.friend-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.action-btn {
  background: #4f46e5;
}

.action-btn.alt {
  background: #7c3aed;
}

.delete-btn {
  background: #ef4444;
}
</style>
