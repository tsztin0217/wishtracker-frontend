<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Dialog from 'primevue/dialog' 
import NavBar from './components/NavBar.vue'
import Login from './components/Login.vue'
import ItemForm from './components/ItemForm.vue'
import StarCursor from './components/StarCursor.vue'
import ItemCards from './components/ItemCards.vue'
import AppFooter from './components/AppFooter.vue'
import WelcomePage from './components/WelcomePage.vue'

const { isAuthenticated, checkAuth } = useAuth()
const showForm = ref(false)
const openForm = (item = null) => {
  selectedItem.value = item ? { ...item } : { 
    name: '', 
    website_url: '',
    description: '',
    price: '',
    tags: [] 
  };
  showForm.value = true;
};
const itemCardsRef = ref(null)
const selectedItem = ref(null)

const handleClose = () => {
  showForm.value = false
  // call fetchItems if the component exists
  itemCardsRef.value?.fetchItems() 
}

const refreshData = () => {
  itemCardsRef.value?.fetchItems();
}

onMounted(() => {
  checkAuth()
})

</script>

<template>
  <StarCursor />
  <NavBar />
  <main>
    <!-- <Login /> -->
    <div v-if="isAuthenticated">
      <ItemCards ref="itemCardsRef" @edit-item="openForm" @add-item="openForm" />
      <Dialog 
        v-model:visible="showForm" 
        modal
        dismissable-mask
        :header="selectedItem && selectedItem.id ? 'Edit Wish Item' : 'Add a Wish Item'" 
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      >
        <ItemForm v-model="selectedItem" @close="handleClose" @tagDeleted="refreshData" />
      </Dialog>
    </div>
    <div v-else>
      <WelcomePage />
    </div>

  </main>
  <AppFooter />
</template>


<style scoped>
main {
  flex: 1 0 auto;
  padding: 2rem;
  width: 100vw;
  /* box-sizing: border-box; */
  /* border: 1px solid blue; */

}
</style>
