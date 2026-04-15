<template>
  <section class="card">
    <h2>Каталог подарков</h2>
    <p>Ниже пример категорий для быстрого выбора идеи.</p>

    <ul>
      <li>🎧 Гаджеты и электроника</li>
      <li>🏡 Уют для дома</li>
      <li>🎨 Впечатления и хобби</li>
      <li>💼 Подарки для коллег</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'WaterCalculatorView'
};
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.08);
}

ul {
  margin: 0.75rem 0 0;
  padding-left: 1.2rem;
}
</style>
