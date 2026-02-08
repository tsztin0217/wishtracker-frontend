<script setup>
import { computed, ref, shallowRef } from 'vue'
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'
import { uploadImage } from '@/composables/uploadImage'
import { useLinkPreview } from '@/composables/useLinkPreview'
import AddTag from './AddTag.vue';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const nameError = ref('')
const nameInputRef = ref(null)

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

const { isFetching, fetchedImageUrl, error: linkPreviewError, fetchLinkPreview: fetchPreview, clearFetchedImage } = useLinkPreview()

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
  if (!model.value.name || model.value.name.trim() === '') {
    nameError.value = 'Item name is required';

    if (nameInputRef.value) {
      nameInputRef.value.focus();
      nameInputRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  nameError.value = '';
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
      price: model.value.price === "" ? null : model.value.price,
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
  <form @submit.prevent class="details-form">
    <div class="form-row">
      <label for="newLink">Website</label>
      <div>
        <div class="input-group">
          <input id="newLink" type="url" v-model="model.website_url" placeholder="https://..." />
          <button type="button" @click="fetchLinkPreview" :disabled="isFetching || !model.website_url" class="fetch-btn">
            {{ isFetching ? 'Fetching...' : 'Fetch' }}
          </button>
        </div>
        <div v-if="linkPreviewError" class="error-message">{{ linkPreviewError }}</div>
      </div>
    </div>

    <div class="form-row">
      <label for="newName">Item Name*</label>
      <div>
        <input
          ref="nameInputRef"
          id="newName" 
          type="text" required 
          v-model="model.name" 
          :class="{ 'input-error': nameError }"
          @input="nameError = ''"
          placeholder="Name of item" 
        >
        <div v-if="nameError" class="error-message">{{ nameError }}</div>
      </div>
    </div>

    <div class="form-row">
      <label for="newPrice">Price</label>
      <input id="newPrice" type="number" min="0" v-model="model.price" placeholder="0.00" />
    </div>

    <div class="form-row vertical">
      <label for="newDescription">Description</label>
      <textarea id="newDescription" rows="3" v-model="model.description" maxlength="500"></textarea>
      <div class="char-count" :class="{ 'text-danger': model.description?.length >= 500 }">
        {{ model.description?.length || 0 }}/500
      </div>
    </div>

    <div class="form-row vertical">
      <label>Tags</label>
      <AddTag v-model="model.tags" @tagDeleted="(id) => $emit('tagDeleted', id)" />
    </div>

    <div v-if="!isEdit" class="image-section">
      <label>Product Image</label>
      <div v-if="fetchedImageUrl || previewUrl" class="preview-card">
        <img :src="fetchedImageUrl || previewUrl" alt="Preview" />
        <button type="button" @click="clearFetchedImage(); selectedFile = null" class="remove-img-btn">×</button>
      </div>
      
      <div v-else ref="dropZoneRef" class="drop-zone" :class="{ 'is-active': isOverDropZone }" @click="open">
        <span>{{ isOverDropZone ? 'Release to upload' : 'Drag image or click to upload' }}</span>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" @click="cancel" class="btn-secondary">Cancel</button>
      <button type="button" @click="handleSubmit" :disabled="isSaving" class="btn-primary">
        {{ isSaving ? 'Saving...' : (isEdit ? 'Update Item' : 'Create Item') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.details-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 1rem;
}

.form-row.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--form-muted-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input, textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--form-field-border);
  border-radius: 6px;
  background: var(--form-field-bg);
  color: var(--form-field-text);
  outline: none;
}

input:focus, textarea:focus {
  border-color: var(--form-field-focus);
  box-shadow: 0 0 0 1px var(--form-field-focus);
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.fetch-btn {
  padding: 0 1rem;
  min-width: 96px;
  background-color: var(--add-btn-bg);
  color: var(--add-btn-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  transition: all 0.3s ease;
  background-size: cover;
  background-position: center;
}

.char-count {
  align-self: flex-end;
  font-size: 0.7rem;
  color: var(--form-muted-text);
}

/* Image Styling */
.preview-card {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--form-field-border);
}

.preview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.drop-zone {
  border: 2px dashed var(--form-field-border);
  border-radius: 8px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--form-muted-text);
  font-size: 0.8rem;
}
.is-active {
  border-color: var(--form-field-focus);
  color: var(--form-field-focus);
}

.input-error {
  border-color: #ff4444 !important;
}

.error-message {
  color: #ff4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: var(--add-btn-bg);
  color: var(--add-btn-text);
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-size: cover;
  background-position: center;
}

.btn-secondary {
  background: transparent;
  color: #888;
  border: none;
  cursor: pointer;
}

.fetch-btn:hover,
.btn-primary:hover {
	background-image: url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2h5YmJsbHpkZTR1MGV6ZWxveWU4dWV0aHh3dnhlNmxtdXJwMW1iaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0HEiQoSPsfkity/giphy.gif');
	color: white;
	box-shadow: 0 4px 15px rgba(132, 154, 254, 0.4);
}

:root.dark .fetch-btn:hover,
:root.dark .btn-primary:hover {
	background-image: url('https://media1.tenor.com/m/r47ZgZUPwEwAAAAC/4th-of-july-night.gif');
}
</style>
