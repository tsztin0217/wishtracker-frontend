<script setup>
import { ref, shallowRef } from 'vue'
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'

const header = ref('Add a Wish Item')
const emit = defineEmits(['close'])

const selectedFile = shallowRef(null)
const previewUrl = useObjectUrl(selectedFile)

const { open, onChange } = useFileDialog({ accept: 'image/*', multiple: false })

onChange((files) => {
  if (files?.[0]) selectedFile.value = files[0]
})

const dropZoneRef = ref(null)

function onDrop(files) {
  if (files?.[0]) selectedFile.value = files[0]
}

const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop, dataTypes: ['image/jpeg', 'image/png'] })

const cancel = () => emit('close')

const newLink = ref('')
const newName = ref('')
const newDescription = ref('')
const newPrice = ref('')


const tags = ref([])

const addTagInput = () => {
  tags.value.push('') 
}

const removeTag = (index) => {
  tags.value.splice(index, 1)
}

</script>

<template>
  <h1>{{ header }}</h1>
  <div>
    <label for="newLink">Link:</label>
    <input id="newLink" type="url" v-model="newLink" placeholder="https://example.com/product" class="long-field"/>
  </div>
  <div>
    <label for="newName">Item Name:</label>
    <input id="newName" type="text" required v-model="newName" />
  </div>
  <div>
    <label for="newDescription">Description:</label>
    <textarea id="newDescription" rows="4" v-model="newDescription"></textarea>
  </div>
  <div>
    <label for="newPrice">Price:</label>
    <input id="newPrice" type="number" min="0" v-model="newPrice"/>
  </div>
  <div>
    <label>Tags:</label>
    <button type="button" @click="addTagInput">+</button>
    
    <div v-for="(tag, index) in tags" :key="index" class="tag-row">
      <input 
        type="text" 
        v-model="tags[index]" 
        placeholder="Enter tag" 
        class="short-field" 
      />
      <button type="button" @click="removeTag(index)">Delete</button>
    </div>
  </div>
  <!-- ------------------------ -->

  <div 
    ref="dropZoneRef" 
    class="drop-zone" 
    :class="{ 'is-active': isOverDropZone }"
  >
    <div v-if="previewUrl" class="preview-wrap">
      <img :src="previewUrl" class="preview-img" alt="Preview" />
      <button type="button" @click="selectedFile = null">Remove Image</button>
    </div>
    <div v-else>
      <p v-if="!isOverDropZone">Drag and drop a product image here</p>
      <p v-else>Release to upload</p>
      <button type="button" @click="open">Or Select Files</button>
    </div>
  </div>

  <button type="submit">Submit</button>
  <button type="button" @click="cancel">Cancel</button>
</template>

<style scoped>
.short-field {
  width: 15%;
}
.long-field {
  width: 50%;
}
.drop-zone {
  border: 2px dashed #ffffff;
  padding: 20px;
  text-align: center;
  transition: 0.3s;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.is-active {
  border-color: #98fe84;
  background-color: rgba(162, 222, 195, 0.1);
}
.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  display: block;
  margin: 0 auto 10px;
}
.preview-wrap {
  width: 100%;
}

.tag-row {
  margin-top: 5px;
  display: flex;
  gap: 5px;
  align-items: center;
}
</style>
