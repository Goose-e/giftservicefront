<template>
  <section class="card">
    <h2>Страница друга</h2>
    <p>
      ID профиля: <strong>{{ $route.params.code }}</strong>
    </p>
    <p>Здесь можно показывать вишлист друга и персональные рекомендации.</p>
  </section>
</template>

<script>
export default {
  name: 'CompanyView'
};
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.08);
}
</style>
