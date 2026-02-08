<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="footer-text">
        &copy;{{ year }} WishTracker
      </span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: 0.75rem 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  justify-content: center;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  color: var(--form-muted-text);
}
</style>
