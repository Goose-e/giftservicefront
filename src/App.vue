<template>
  <div class="layout">
    <header class="header">
      <router-link class="brand" to="/">Gift Service</router-link>
      <nav class="nav">
        <router-link to="/">Главная</router-link>
        <router-link to="/water">Каталог подарков</router-link>
        <router-link to="/usercompanies">Друзья</router-link>
        <router-link to="/profil">Профиль</router-link>
        <router-link to="/authorization">Вход</router-link>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppRoot'
};
</script>

<style scoped>
:global(body) {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, Arial, sans-serif;
  background: linear-gradient(160deg, #f7f4ff 0%, #f6fbff 100%);
  color: #1f2937;
}

.layout {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.08);
}

.brand {
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  color: #4f46e5;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.nav a {
  text-decoration: none;
  color: #374151;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
}

.nav a.router-link-active {
  background: #4f46e5;
  color: #fff;
}

.content {
  margin-top: 1rem;
}
</style>
