import { ref, computed } from 'vue'

const user = ref(null)
const loading = ref(false)
const error = ref(null)

const VITE_API_URL = import.meta.env.VITE_API_URL

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null)

  const checkAuth = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${VITE_API_URL}/user`, {
        method: 'GET',
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Backend response:', data)
        user.value = data.user  // Extract the user object
        console.log('User:', user.value)
      } else {
        user.value = null
      }
    } catch (err) {
      error.value = err.message
      user.value = null
    } finally {
      loading.value = false
    }
  }


  const login = () => {
    window.location.href = `${VITE_API_URL}/login`
  }


  const logout = async () => {
    loading.value = true
    try {
      const response = await fetch(`${VITE_API_URL}/logout`, {
        method: 'POST', 
        credentials: 'include'
      })
      if (response.ok) user.value = null
    } catch (err) {
      error.value = "Logout failed"
    } finally {
      loading.value = false
    }
  }


  return {
    user,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    login,
    logout
  }
}
