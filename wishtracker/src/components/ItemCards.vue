<script setup>
import { ref, onMounted, computed } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Menu from 'primevue/menu'


const VITE_API_URL = import.meta.env.VITE_API_URL

const items = ref([])
const selectedTags = ref([])
const emit = defineEmits(['edit-item'])
const isDetailVisible = ref(false)
const selectedItemForDetail = ref(null)
const menuRefs = ref({})
const menu = ref()

const openDetails = (item) => {
  selectedItemForDetail.value = item
  isDetailVisible.value = true
}

const toggleMenu = (event, itemId) => {
  event.stopPropagation()
  menuRefs.value[itemId].toggle(event)
}

const getMenuItems = (item) => [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => emit('edit-item', item)
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteItem(item.id)
  }
]

const getDomain = (url) => {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch (e) {
    return url
  }
}

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
  <div class="item-list-wrapper">
    <div class="controls">
      <MultiSelect 
        v-model="selectedTags" 
        :options="allTags" 
        optionLabel="name" 
        display="chip" 
        class="filter-dropdown"
        placeholder="Filter by Tags"
      />
    </div>

    <div class="item-list">
      <div v-for="item in filteredItems" :key="item.id" class="item-card" @click="openDetails(item)" style="cursor: pointer;">
        <Button 
          icon="pi pi-ellipsis-v" 
          class="menu-btn" 
          text 
          rounded 
          @click="toggleMenu($event, item.id)"
          v-tooltip="'Actions'"
        />
        <Menu :ref="el => { if (el) menuRefs[item.id] = el }" :model="getMenuItems(item)" :popup="true" />
        
        <div class="image-wrapper">
          <img v-if="item.img_url" :src="item.img_url" alt="Item image"/>
          <i v-else class="pi pi-image placeholder-icon"></i>
        </div>
        <h3 :title="item.name">{{ item.name }}</h3>
        <p :title="item.description">{{ item.description }}</p>
        <span>
          <i class="pi pi-dollar price-icon"></i>
          {{ item.price }}
        </span>
        <div class="date-row">
            <i class="pi pi-calendar date-icon"></i>
            {{ new Date(item.created_at).toLocaleDateString() }}
        </div>
        <!-- <i class="pi pi-tags" v-tooltip="'Tags'"></i>
        <p v-if="item.tags.length > 0">Tags: {{ item.tags.map(tag => tag.name).join(', ') }}</p> -->
        
        <div v-if="item && item.tags && item.tags.length > 0" class="tag-row">
  
          <i class="pi pi-tags meta-icon" v-tooltip="'Tags'"></i>
    
  
          <div class="tag-list">
            <Tag 
              v-for="tag in item.tags" 
              :key="tag.id" 
              :value="tag.name" 
              severity="secondary" 
              class="custom-tag"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isDetailVisible"
    :header="selectedItemForDetail?.name"
    modal
    dismissableMask
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    style="width: 70vw;"
  >
    <div v-if="selectedItemForDetail" class="detail-container">
      <div class="detail-left">
        <div class="detail-image">
          <img v-if="selectedItemForDetail.img_url" :src="selectedItemForDetail.img_url" alt="Item image"/>
          <i v-else class="pi pi-image placeholder-icon"></i>
        </div>
        <div v-if="selectedItemForDetail.website_url" class="website-link">
          <a :href="selectedItemForDetail.website_url" target="_blank" rel="noopener noreferrer">
            {{ getDomain(selectedItemForDetail.website_url) }}
            <i class="pi pi-external-link"></i>
          </a>
        </div>
      </div>
      <div class="detail-content">
        <p>{{ selectedItemForDetail.description }}</p>
        <p class="price-row">
          <i class="pi pi-dollar price-icon"></i>
          {{ selectedItemForDetail.price }}
        </p>
        <div class="detail-bottom">
          <div v-if="selectedItemForDetail.tags && selectedItemForDetail.tags.length > 0" class="tag-row">
            <i class="pi pi-tags meta-icon" v-tooltip="'Tags'"></i>
            <div class="tag-list">
              <Tag 
                v-for="tag in selectedItemForDetail.tags" 
                :key="tag.id" 
                :value="tag.name" 
                severity="secondary" 
                class="custom-tag"
              />
            </div>
          </div>
          <div class="detail-dates">
            <div class="date-row">
                <i class="pi pi-calendar date-icon"></i>
                Created: {{ new Date(selectedItemForDetail.created_at).toLocaleDateString() }}
            </div>
            <div v-if="selectedItemForDetail.last_updated" class="date-row">
                <i class="pi pi-clock date-icon"></i>
                Updated: {{ new Date(selectedItemForDetail.last_updated).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.item-list-wrapper {
  width: 100%; 
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.controls { 
  margin-bottom: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  gap: 2.5rem;
  justify-content: center;
}

.item-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 200px);
  
  gap: 2.5rem;
  justify-content: center; 
}

.filter-dropdown { 
  width: 100%; 
  max-width: 400px; 
}

.date-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #999999;
  margin-top: auto;
}

.date-icon {
  font-size: 0.9rem;
}

.detail-content .date-row {
  justify-content: flex-start;
  align-items: baseline;
}
.item-card {
  position: relative;
  /* width: 100%; */
  width: 220px;
  height: 320px;
  padding: 25px 10px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;
  margin: 0 auto;
}

.menu-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  color: #999;
}

.item-card img {
  /* position: absolute; */
  top: 25px;
  max-height: 100%;
}

.item-card h3 {
  font-weight: bold;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* margin: 0.5rem auto; */
  margin-top: 0;
  margin-bottom: 0;
}

.item-card p {
  font-size: 0.9rem;
  display: -webkit-box; 
  /* margin: 0.1rem 0; */
  margin: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal; 
  line-clamp: 2; 
  line-height: 1.1;
}

.item-card:hover {
  box-shadow: 
    0 0 10px #e5c6f2,
    0 0 20px #c984fe,
    0 0 40px rgba(138, 49, 227, 0.4);
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  border-radius: 2px;
  margin-top: 10px;
  margin-bottom: 2px;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 8px;
  /* margin: 0 auto 1px auto; */
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 2px;
}

/* Tags in item cards - centered */
.item-card .tag-row {
  justify-content: center;
}

/* Tags in detail dialog - left-aligned */
.detail-content .tag-row {
  justify-content: flex-start;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.meta-icon {
  display: flex;
  font-size: 0.9rem;
  color: #b4dae9;
  align-items: center;
  margin-top: 4px;
}

.custom-tag {
  font-size: 0.9rem;
}

.detail-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.detail-left {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: center;
}

.detail-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.detail-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.detail-image .placeholder-icon {
  font-size: 10rem;
  color: #ddd;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
}

.detail-content h3 {
  margin: 0;
  font-size: 1.5rem;
}

.detail-content p {
  margin: 0;
  line-height: 1.6;
}

.detail-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-content .date-row {
  justify-content: flex-start;
  font-size: 0.8rem;
  color: #999999;
}

.item-list i {
  font-size: 0.8rem;
}


.website-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  /* background-color: rgba(102, 126, 234, 0.1); */
  border-radius: 6px;
  word-break: break-all;
  justify-content: center;
}

.website-link i {
  color: #667eea;
  font-size: 0.7rem;
}

.website-link a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.website-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .detail-container {
    flex-direction: column;
  }
  
  .detail-left {
    flex: 0 0 auto;
    width: 100%;
  }
}
</style>