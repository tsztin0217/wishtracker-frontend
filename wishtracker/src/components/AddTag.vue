<script setup>
import { ref } from 'vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const selectedTags = ref([]);
const allAvailableTags = ref([
  { id: 1, name: 'Vue' },
  { id: 2, name: 'Python' }
]);


const handleNewTag = (newTagName) => {
  const newTag = {
    name: newTagName
  };
  allAvailableTags.value.push(newTag);
  selectedTags.value.push(newTag);
};
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
