<script setup>
import { ref, onMounted } from 'vue'
const VITE_API_URL = import.meta.env.VITE_API_URL
const items = ref([])
async function fetchItems() {
  const res = await fetch(`${VITE_API_URL}/items`, { credentials: 'include' })
  const data = await res.json()
  items.value = data.items
}
onMounted(fetchItems)

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
        const res = await fetch(`${VITE_API_URL}/items/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
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

onMounted(fetchItems)

</script>

<template>
  <div class="item-list">
    <div v-for="item in items" :key="item.id" class="item-card">
      <a :href="item.website_url" target="_blank"><img :src="item.img_url" alt="Item image" /></a>
      <h3 :title="item.name">{{ item.name }}</h3>
      <p>{{ item.description }}</p>
      <p>Price: ${{ item.price }}</p>
      <p>Created at: {{ new Date(item.created_at).toLocaleString() }}</p>
      <p>Tags: {{ item.tags.map(tag => tag.name).join(', ') }}</p>
      <button class="delete-btn" @click="deleteItem(item.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.item-card {
  width: 100%;
  max-width: 200px;
  padding: 10px;
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
</style>

