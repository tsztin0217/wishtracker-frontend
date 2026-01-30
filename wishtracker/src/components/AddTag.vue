<script setup>
import { ref, onMounted } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
const emit = defineEmits(['tagDeleted']);

const VITE_API_URL = import.meta.env.VITE_API_URL;

const selectedTags = defineModel(); 
const allAvailableTags = ref([]);
const filteredTags = ref([]);

const searchTags = (event) => {
    const query = event.query.toLowerCase();

    filteredTags.value = allAvailableTags.value.filter(t => 
        t.name.toLowerCase().includes(query)
    );
};

// logic to handle adding a new tag when user presses Enter
const onKeyUp = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
        const newTagName = event.target.value.trim();
        
        // check if it already exists in the selection to avoid duplicates
        const exists = selectedTags.value?.some(t => t.name.toLowerCase() === newTagName.toLowerCase());
        
        if (!exists) {
            const newTag = { name: newTagName };
            if (!selectedTags.value) selectedTags.value = [];
            selectedTags.value.push(newTag);
            
            event.target.value = '';
        }
    }
};

async function fetchTags() {
    try {
        const res = await fetch(`${VITE_API_URL}/tags`, { credentials: 'include' });
        if (res.ok) {
            const data = await res.json();
            allAvailableTags.value = data.tags; // uses tag_bp.get_all_tags logic
        }
    } catch (err) {
        console.error("Failed to load tags:", err);
    }
}

onMounted(fetchTags);

const confirmPermanentDelete = async (tag) => {
  if (!confirm(`Permanently delete "${tag.name}"? This removes it from ALL items.`)) return;

  try {
    const res = await fetch(`${VITE_API_URL}/tags/${tag.id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (res.ok) {
      // remove from the global suggestions list
      allAvailableTags.value = allAvailableTags.value.filter(t => t.id !== tag.id);
      // remove from the current item's selection if it was already picked
      selectedTags.value = selectedTags.value.filter(t => t.id !== tag.id);
      // update the visible dropdown list
      filteredTags.value = filteredTags.value.filter(t => t.id !== tag.id);

      emit('tagDeleted', tag.id); 
    }
  } catch (err) {
    alert("Failed to delete tag");
  }
};
</script>

<template>
  <div class="card p-fluid">
    <AutoComplete 
      v-model="selectedTags" 
      multiple 
      :suggestions="filteredTags" 
      @complete="searchTags" 
      @keyup="onKeyUp" 
      optionLabel="name" 
      placeholder="Find or create new tags"
      :dropdown="true"
      class="w-full"
    >
    <template #option="slotProps">
        <div class="flex align-items-center justify-content-between w-full">
          <span>{{ slotProps.option.name }}</span>
          
          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            text 
            rounded 
            size="small"
            @click.stop="confirmPermanentDelete(slotProps.option)" 
            v-tooltip.top="'Delete tag permanently'"
          />
        </div>
      </template>
    </AutoComplete>

  </div>
</template>


<style scoped>
.flex {
  display: flex;
  align-items: center;
  gap: 10px;
}
.justify-content-between {
  justify-content: space-between;
}
.w-full {
  width: 100%;
}
</style>