<script setup>
import { ref } from 'vue'
const emit = defineEmits(['tagCreated'])

const newTagName = ref('')

const submitTag = () => {
    if(!newTagName.value) return;
    const createdTag = { id: Date.now(), name: newTagName.value }
    emit('tagCreated', createdTag)
    newTagName.value = ''
}
</script>

<template>
  <div class="tag-creator">
    <h3>Create New Tag</h3>
    <input v-model="newTagName" class="short-field" placeholder="e.g. Electronics" />
    <button @click="submitTag">Add Tag</button>
  </div>
</template>

<style scoped>
.tag-creator { border: 1px solid white; margin-top: 1rem; margin-bottom: 1rem; padding: 1rem; }
.short-field {
  width: 20%;
}
</style>
