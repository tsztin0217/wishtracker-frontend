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

     // 1. Snag user_id from URL if it's there (after login redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('user_id');
    
    if (userIdFromUrl) {
      localStorage.setItem('user_id', userIdFromUrl);
      // Clean the URL so the ID isn't hanging out in the address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const storedId = localStorage.getItem('user_id');
    
    try {
      const response = await fetch(`${VITE_API_URL}/user`, {
        method: 'GET',
        credentials: 'include', 
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('user_id')}`
          'X-User-ID': storedId || '' 
        }
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
      localStorage.removeItem('user_id');
      user.value = null
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
