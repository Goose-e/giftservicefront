<template>
  <slot />
</template>

<script setup>
</script>

<style>
:root {
  --text-main: #202939;
  --text-muted: #6b7280;
  --surface: #f8f8fb;
  --white: #fff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  color: var(--text-main);
  background: #f3f4f6;
}

a {
  color: inherit;
  text-decoration: none;
}

.layout {
  min-height: 100vh;
}

.topbar {
  height: 76px;
  padding: 0 44px;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 34px;
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 36px;
  line-height: 1;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
  margin-right: 24px;
}

.nav-links a {
  font-size: 22px;
  opacity: 0.95;
  padding: 8px 10px;
  border-radius: 12px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.16);
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.logout-btn {
  border: 0;
  color: var(--white);
  padding: 10px 24px;
  border-radius: 28px;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.22);
  transition: background 0.2s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: translateY(-1px);
}

.page-content {
  padding: 46px 60px 80px;
  max-width: 1300px;
}

.page-title {
  font-size: 52px;
  margin: 0;
}

.page-subtitle {
  margin-top: 10px;
  margin-bottom: 34px;
  font-size: 28px;
  color: var(--text-muted);
}

.panel,
.card {
  background: #fefefe;
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(18, 23, 33, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(18, 23, 33, 0.12);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.btn {
  border: 0;
  cursor: pointer;
  font-weight: 700;
  border-radius: 22px;
  padding: 14px 22px;
  color: #fff;
  font-size: 20px;
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.16);
}

.btn-chip {
  border: 0;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 16px;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #d8dce5;
  border-radius: 18px;
  padding: 16px 20px;
  font-size: 18px;
  color: #364152;
  background: #f8f8fb;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.error {
  color: #b91c1c;
  margin-top: 10px;
}

.auth-card {
  max-width: 520px;
  margin: 12vh auto;
  background: white;
  padding: 26px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-card h1 {
  font-size: 40px;
}

.auth-card button {
  border: 0;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 24px;
  color: #fff;
  background: #2563eb;
}

.theme-catalog {
  background: linear-gradient(90deg, #7c3aed, #ec4899);
}

.theme-wishlist {
  background: linear-gradient(90deg, #f97316, #ec4899);
}

.theme-friends {
  background: linear-gradient(90deg, #0891b2, #4f46e5);
}

.theme-victims {
  background: linear-gradient(90deg, #16a34a, #0891b2);
}

.theme-recommendations {
  background: linear-gradient(90deg, #6d28d9, #2563eb);
}

.bg-catalog {
  background: #eeecf4;
}

.bg-wishlist {
  background: #f2edef;
}

.bg-friends {
  background: #dfeaf0;
}

.bg-victims {
  background: #dce9e7;
}

.bg-recommendations {
  background: #edeef7;
}

@media (max-width: 1200px) {
  .brand-text {
    font-size: 30px;
  }

  .nav-links a,
  .logout-btn {
    font-size: 16px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 20px;
  }

  .btn,
  input,
  textarea,
  select,
  .btn-chip {
    font-size: 18px;
  }
}
</style>
