<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Login from './components/Login.vue'
import ItemForm from './components/ItemForm.vue'
import AddTag from './components/AddTag.vue'
import StarCursor from './components/StarCursor.vue';

const { isAuthenticated } = useAuth()
const showForm = ref(false)
const openForm = () => { showForm.value = true }



</script>


<template>
  <StarCursor />
  <main>
    <Login />
    <div v-if="isAuthenticated">
      <AddTag />
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
