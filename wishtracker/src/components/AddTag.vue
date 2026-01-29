<script setup>
import { ref, onMounted } from 'vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const selectedTags = defineModel(); 
const allAvailableTags = ref([]);


const handleNewTag = (newTagName) => {
  const newTag = {
    name: newTagName
  };
  allAvailableTags.value.push(newTag);
  if (!selectedTags.value) selectedTags.value = [];
  selectedTags.value.push(newTag);
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
</script>

<template>
  <div>
    <VueMultiselect
      v-model="selectedTags"
      :options="allAvailableTags"
      :multiple="true"
      :taggable="true"
      label="name"
      track-by="id"
      placeholder="Search or add a tag"
      @tag="handleNewTag"
    />
  </div>
</template>
