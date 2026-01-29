<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Login from './components/Login.vue'
import ItemForm from './components/ItemForm.vue'
import StarCursor from './components/StarCursor.vue'
import ItemCards from './components/ItemCards.vue'

const { isAuthenticated } = useAuth()
const showForm = ref(false)
const openForm = () => { showForm.value = true }
const itemCardsRef = ref(null)

const handleClose = () => {
  showForm.value = false
  // call fetchItems if the component exists
  itemCardsRef.value?.fetchItems() 
}


</script>


<template>
  <StarCursor />
  <main>
    <Login />
    <div v-if="isAuthenticated">
      <button v-if="!showForm" @click="openForm">
        Add a Wish item
      </button>
      <ItemForm v-if="showForm" @close="handleClose" />
      <ItemCards ref="itemCardsRef" />
    </div>

  </main>
</template>


<style scoped>
main {
  padding: 2rem;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
}
</style>
