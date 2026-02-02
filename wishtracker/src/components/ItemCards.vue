<script setup>
import { ref, onMounted, computed } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'

const VITE_API_URL = import.meta.env.VITE_API_URL

const items = ref([])
const selectedTags = ref([])

async function fetchItems() {
  const storedId = localStorage.getItem('user_id');
  try {
    const res = await fetch(`${VITE_API_URL}/items`, { 
      credentials: 'include',
      headers: {
        'X-User-ID': storedId || ''
      }
    })
    if (res.ok) {
      const data = await res.json()
      items.value = data.items || []
    }
    else {
    items.value = []
    }
  } catch (error) {
    console.error('Error fetching items:', error)
    items.value = []
  }
}

const allTags = computed(() => {
  const tagsMap = new Map()
  items.value?.forEach(item => {
    item.tags?.forEach(tag => tagsMap.set(tag.id, tag))
  })
  return Array.from(tagsMap.values())
})

const filteredItems = computed(() => {
  if (selectedTags.value.length === 0) return items.value
  
  return items.value.filter(item => 
  // Show item if it has ALL selected tags
  selectedTags.value.every(filterTag => 
  item.tags.some(itemTag => itemTag.id === filterTag.id)
)
)
})

async function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this item?')) return
  const storedId = localStorage.getItem('user_id');
  
  try {
    const res = await fetch(`${VITE_API_URL}/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-User-ID': storedId || ''
      }
    })
    if (res.ok) {
      // remove from local list to trigger UI update
      items.value = items.value.filter(item => item.id !== itemId)
    } else {
      alert('Failed to delete item')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// expose fetchItems to parent via template ref
defineExpose({ fetchItems })
onMounted(fetchItems)


</script>

<template>
  <div class="controls">
    <MultiSelect 
      v-model="selectedTags" 
      :options="allTags" 
      optionLabel="name" 
      placeholder="Filter by Tags" 
      display="chip" 
      class="filter-dropdown"
    />
  </div>
  <div class="item-list-wrapper">
    <div class="item-list">
      <div v-for="item in filteredItems" :key="item.id" class="item-card">
        <Button 
          icon="pi pi-times" 
          severity="danger" 
          rounded 
          text 
          class="delete-btn" 
          @click="deleteItem(item.id)" 
        />
        <a :href="item.website_url" target="_blank"><img :src="item.img_url" alt="Item image" /></a>
        <h3 :title="item.name">{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p>${{ item.price }}</p>
        <p>Created at: {{ new Date(item.created_at).toLocaleString() }}</p>
        <p v-if="item.tags.length > 0">Tags: {{ item.tags.map(tag => tag.name).join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls { margin-bottom: 20px; }

.filter-dropdown { width: 100%; max-width: 400px; }

/* .item-list-wrapper {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid green;
  text-align: center;
  width: fit-content
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 0 auto;
  justify-content: flex-start;
} */

.item-list-wrapper {
  /* No width: fit-content needed here */
  width: 100%; 
  margin: 0 auto;
}

.item-list {
  display: grid;
  width: 100%;
  /* 'auto-fill' creates as many columns as will fit. */
  /* '200px' is your card width. */
  grid-template-columns: repeat(auto-fill, 200px);
  /* border: 1px solid red; for debugging */
  
  gap: 2rem;
  
  /* This centers the entire 'grid' of cards within the wrapper. */
  /* Because it's a grid, the items stay locked in their columns. */
  justify-content: center; 
}

.item-card {
  position: relative;
  /* width: 100%;
  max-width: 200px; */
  padding: 20px 10px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;
}

.item-card img {
  max-width: 100%;
  height: auto;
  max-height: 100px;
}

.item-card h3 {
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-card p {
  font-size: 0.9rem;
  margin: 0.3rem 0;
}

.item-card .delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 2rem;
  height: 2rem;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.item-card:hover {
  box-shadow: 
    0 0 10px #c6dff2,
    0 0 20px #84d9fe,
    0 0 40px rgba(13, 117, 228, 0.4);
}
</style>

