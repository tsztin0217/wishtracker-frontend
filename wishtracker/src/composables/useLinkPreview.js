import { ref } from 'vue'

export function useLinkPreview() {
  const isFetching = ref(false)
  const fetchedImageUrl = ref(null)
  const error = ref(null)
  const VITE_API_URL = import.meta.env.VITE_API_URL

  async function fetchLinkPreview(url) {
    if (!url) {
      error.value = 'Please enter a URL first'
      return null
    }
    
    error.value = null
    isFetching.value = true
    try {
      const res = await fetch(`${VITE_API_URL}/linkpreview/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        credentials: 'include'
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); 
        error.value = 'This website could not be autofilled by LinkPreview'
        return null
      }
      
      const data = await res.json()
      console.log('LinkPreview response:', data)
      
      if (data.image) {
        fetchedImageUrl.value = data.image
      }
      
      return data
      
    } catch (err) {
      console.error('LinkPreview error:', err)
      error.value = 'This website could not be autofilled by LinkPreview'
      return null
    } finally {
      isFetching.value = false
    }
  }

  function clearFetchedImage() {
    fetchedImageUrl.value = null
  }

  return {
    isFetching,
    fetchedImageUrl,
    error,
    fetchLinkPreview,
    clearFetchedImage
  }
}
