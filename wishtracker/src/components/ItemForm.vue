<script setup>
import { ref, shallowRef } from 'vue'
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'
import { uploadImage } from '@/composables/uploadImage'
import AddTag from './AddTag.vue';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const header = ref('Add a Wish Item')
const emit = defineEmits(['close', 'tagDeleted'])

const selectedFile = shallowRef(null)
const previewUrl = useObjectUrl(selectedFile)

const { open, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
const isSaving = ref(false)


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

async function handleSubmit() {
  if (!newName.value) return alert('Item Name is required');
  
  isSaving.value = true;
  try {
    let uploadedData = { public_url: '', gcs_path: '' };

    if (selectedFile.value) {
      uploadedData = await uploadImage(selectedFile.value);
    }

      const finalForm = {
      name: newName.value,
      website_url: newLink.value,
      description: newDescription.value,
      price: newPrice.value,
      img_url: uploadedData.public_url,
      gcs_path: uploadedData.gcs_path,
      tags: tags.value.map(t => typeof t === 'string' ? t : t.name)
    };
    
    const saveRes = await fetch(`${VITE_API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalForm),
      credentials: 'include'
    });

    if (!saveRes.ok) throw new Error('Database save failed');
    
    emit('close');
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    isSaving.value = false;
  }
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
    <textarea id="newDescription" rows="4" v-model="newDescription" maxlength="250"></textarea>
    <small :class="{ 'text-danger': newDescription.length >= 250 }">
    {{ newDescription.length }} / 250 characters </small>
  </div>
  <div>
    <label for="newPrice">Price:</label>
    <input id="newPrice" type="number" min="0" v-model="newPrice"/>
  </div>
  <div>
    <label>Tags:</label>
      <AddTag v-model="tags" @tagDeleted="(id) => $emit('tagDeleted', id)" />
  </div>

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

  <button type="submit" @click="handleSubmit">Submit</button>
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
  width: 50%;
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

small {
  display: block;
  color: #7d7d7d;
}
.text-danger {
  color: #ff4d4d;
}
</style>
