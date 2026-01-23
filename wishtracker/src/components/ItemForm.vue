<script setup>
import { ref } from 'vue'

const header = ref('Add a Wish Item')

const emit = defineEmits(['close'])

const cancel = () => {
  emit('close')
}

</script>

<template>
    <h1>{{  header  }}</h1>
    <input type="text" placeholder="Paste item link here!">
    <button>Submit</button>
    <button @click="cancel">Cancel</button>
</template>