<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import lightLogo from '@/assets/wishtracker-lighttheme-logo.png'
import darkLogo from '@/assets/wishtracker-darktheme-logo.png'

const { user, logout, login } = useAuth()
const { currentTheme, toggleTheme } = useTheme()

const logoSrc = computed(() =>
  currentTheme.value === 'dark' ? darkLogo : lightLogo
)

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  await logout()
  window.location.reload()
}

function handleLogin() {
  login()
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-brand">
			<img :src="logoSrc" alt="WishTracker" class="navbar-logo" />
      </div>
      
      <div class="navbar-menu">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <span v-if="currentTheme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </button>
        <div v-if="user" class="user-section">
          <div class="user-info">
            <div class="user-avatar">{{ userInitials }}</div>
            <span class="user-name">{{ user.name || user.email }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
        <div v-else class="login-section">
          <button @click="handleLogin" class="login-btn">Login with Google</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--navbar-bg);
  box-shadow: var(--navbar-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
}

.navbar-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--navbar-text);
  font-weight: 600;
}

.navbar-logo {
  height: 32px;
  width: auto;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  border: none;
  background: var(--navbar-chip-bg);
  color: var(--navbar-chip-text);
  border-radius: 999px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s, transform 0.15s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--navbar-text);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--navbar-chip-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--navbar-chip-text);
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.user-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: var(--navbar-chip-bg);
  color: var(--navbar-chip-text);
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.5);
}

.login-btn {
  padding: 0.5rem 1rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
  cursor: pointer;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 640px) {
  .user-name {
    display: none;
  }
  
  .navbar-brand h1 {
    font-size: 1.25rem;
  }
}
</style>
