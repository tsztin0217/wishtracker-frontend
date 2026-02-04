import { ref } from 'vue'

export function useLinkPreview() {
  const isFetching = ref(false)
  const fetchedImageUrl = ref(null)
  const VITE_API_URL = import.meta.env.VITE_API_URL

  async function fetchLinkPreview(url) {
    if (!url) {
      alert('Please enter a URL first')
      return null
    }
    
    isFetching.value = true
    try {
      const res = await fetch(`${VITE_API_URL}/linkpreview/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to fetch link preview')
      
      const data = await res.json()
      console.log('LinkPreview response:', data)
      
      if (data.image) {
        fetchedImageUrl.value = data.image
      }
      
      return data
      
    } catch (err) {
      console.error('LinkPreview error:', err)
      alert(`Error: ${err.message}`)
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
    fetchLinkPreview,
    clearFetchedImage
  }
}
