<template>
  <div class="auth-container">

    <div v-if="isAuthenticated">
      <p>Welcome, {{ user.name }}!</p>
      <p>Debug: {{ user }}</p>
      <button @click="logout">Sign Out</button>
    </div>

    <div v-else>
      <button @click="login" class="google-btn">
        Sign in with Google
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { 
  user, 
  loading, 
  error, 
  isAuthenticated, 
  login, 
  logout, 
  checkAuth 
} = useAuth()

// if logged in
onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
.google-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  justify-content: center;
  /* border: 1px solid white; */
}
.google-btn img { width: 20px; }
.error { color: red; }
</style>
