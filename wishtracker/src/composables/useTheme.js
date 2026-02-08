import { ref, computed, onMounted } from 'vue'

const theme = ref('light')

function applyThemeClass(value) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const isDark = value === 'dark'

  root.classList.toggle('dark', isDark)
  root.classList.toggle('app-dark', isDark)
}

export function useTheme() {
  const currentTheme = computed(() => theme.value)

  const setTheme = (value) => {
    if (value !== 'light' && value !== 'dark') return
    theme.value = value
    try {
      localStorage.setItem('theme', value)
    } catch (e) {
      // ignore storage errors
    }
    applyThemeClass(value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    let initial = 'light'
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') {
        initial = stored
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initial = 'dark'
      }
    } catch (e) {
      // fall back to default
    }
    setTheme(initial)
  })

  return { currentTheme, setTheme, toggleTheme }
}
