<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Login from './components/Login.vue'
import ItemForm from './components/ItemForm.vue'

const { isAuthenticated } = useAuth()
const showForm = ref(false)
const openForm = () => { showForm.value = true }



</script>


<template>
  <main>
    <Login />
    <div v-if="isAuthenticated">
      <button v-if="!showForm" @click="openForm">
        Add a Wish item
      </button>
      <ItemForm v-if="showForm" @close="showForm = false" />
    </div>

  </main>
</template>


<style scoped>
main {
  padding: 2rem;
}
</style>
