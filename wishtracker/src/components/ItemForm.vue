<script setup>
import { computed, ref, shallowRef } from 'vue'
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'
import { uploadImage } from '@/composables/uploadImage'
import { useLinkPreview } from '@/composables/useLinkPreview'
import AddTag from './AddTag.vue';
const VITE_API_URL = import.meta.env.VITE_API_URL;

// const header = ref('Add a Wish Item')
const emit = defineEmits(['close', 'tagDeleted'])

const model = defineModel(
  { 
    default: () => (
      {
        name: '',
        website_url: '',
        description: '',
        price: '',
        tags: [] 
      }
    ) 
  }
)

const isEdit = computed(() => !!model.value?.id)

const { isFetching, fetchedImageUrl, fetchLinkPreview: fetchPreview, clearFetchedImage } = useLinkPreview()

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

async function fetchLinkPreview() {
  const data = await fetchPreview(model.value.website_url)
  if (data) {
    // Autofill form fields (always overwrite)
    if (data.title) model.value.name = data.title
    if (data.description) model.value.description = data.description
    if (data.image) model.value.img_url = data.image
  }
}

// const newLink = ref('')
// const newName = ref('')
// const newDescription = ref('')
// const newPrice = ref('')


// const tags = ref([])

async function handleSubmit() {
  if (!model.value.name) return alert('Item Name is required');
  const storedId = localStorage.getItem('user_id');
  
  isSaving.value = true;
  try {
    let uploadedData = { public_url: '', gcs_path: '' };

    // Only upload if user selected a file and no fetched image
    if (selectedFile.value && !fetchedImageUrl.value) {
      uploadedData = await uploadImage(selectedFile.value);
    }

      const payload = {
      ...model.value,
      img_url: fetchedImageUrl.value || uploadedData.public_url,
      gcs_path: fetchedImageUrl.value ? '' : uploadedData.gcs_path,
      tags: (model.value.tags || []).map(t => typeof t === 'string' ? t : t.name)
    };
    
    const url = isEdit.value ? `${VITE_API_URL}/items/${model.value.id}` : `${VITE_API_URL}/items`;
    const method = isEdit.value ? 'PATCH' : 'POST';

    const saveRes = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'X-User-ID': storedId || ''
      },
      body: JSON.stringify(payload),
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
  <div>
    <label for="newLink">Link: </label>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <input id="newLink" type="url" required v-model="model.website_url" placeholder="https://example.com/product" class="long-field"/>
      <button type="button" @click="fetchLinkPreview" :disabled="isFetching || !model.website_url" class="fetch-btn">
        {{ isFetching ? 'Fetching...' : 'Fetch' }}
      </button>
    </div>
  </div>
  <div>
    <label for="newName">Item Name: </label>
    <input id="newName" type="text" required v-model="model.name" />
  </div>
  <div>
    <label for="newDescription">Description: </label>
    <textarea id="newDescription" rows="4" v-model="model.description" maxlength="250"></textarea>
    <small :class="{ 'text-danger': model.description?.length >= 250 }">
    {{ model.description?.length || 0 }} / 250 characters </small>
  </div>
  <div>
    <label for="newPrice">Price: </label>
    <input id="newPrice" type="number" min="0" v-model="model.price"/>
  </div>
  <div>
    <label>Tags:</label>
      <AddTag v-model="model.tags" @tagDeleted="(id) => $emit('tagDeleted', id)" />
  </div>

  <!-- hide image upload if editing -->
  <div v-if="!isEdit">
    <div v-if="fetchedImageUrl" class="preview-wrap">
      <img :src="fetchedImageUrl" class="preview-img" alt="Preview" />
      <button type="button" @click="clearFetchedImage(); model.img_url = ''">Remove Image</button>
    </div>
    <div v-else
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
  </div>

  <button type="submit" @click="handleSubmit">{{ isEdit ? 'Save' : 'Submit' }}</button>
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
div {
  margin-top: 10px;
}
</style>
