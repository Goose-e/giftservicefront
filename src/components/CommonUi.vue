<template>
  <slot />
</template>

<script setup>
</script>

<style>
body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f8fafc; color: #1e293b; }
.app { display: grid; grid-template-columns: 230px 1fr; min-height: 100vh; }
.sidebar { background: #fff; border-right: 1px solid #e2e8f0; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sidebar a { text-decoration: none; color: #334155; padding: 8px 10px; border-radius: 8px; }
.sidebar a.router-link-active { background: #2563eb; color: #fff; }
.main { padding: 20px; }
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
input, textarea, select { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; }
button { background: #2563eb; color: #fff; border: 0; border-radius: 8px; padding: 8px 10px; cursor: pointer; }
button.secondary { background: #475569; }
.error { color: #b91c1c; }
.reason { background: #eff6ff; border-left: 3px solid #2563eb; padding: 6px; border-radius: 6px; }
.auth-card { max-width: 400px; margin: 10vh auto; background: white; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; display:flex; flex-direction:column; gap:10px; }
</style>
