<template>
  <div class="welcome-wrapper">
    <!-- Top Section -->
    <header class="top-section">
      <h1 class="gradient-text">Welcome to WishTracker!</h1>
      <p class="subtitle">Your personal wishlist dashboard—no more lost links or endless tabs!</p>
    </header>

    <!-- Content Card -->
    <div class="content-card">
      <p class="intro-text">
        Save products you’re interested in, organize them with tags, and revisit them in one click. 
        WishTracker keeps all your ‘maybe later’ items in one tidy place.
      </p>

      <div class="features-grid">
        <div class="feature-item">
          <div class="icon-circle">
            <i class="pi pi-plus"></i>
          </div>
          <h3>Save Fast</h3>
          <p>Click "Add Item" to save products from any store by link or manual entry.</p>
        </div>

        <div class="feature-item">
          <div class="icon-circle">
            <i class="pi pi-tags"></i>
          </div>
          <h3>Stay Organized</h3>
          <p>Use tags like 'Tech' or 'Birthday' to categorize by occasion or priority.</p>
        </div>

        <div class="feature-item">
          <div class="icon-circle">
            <i class="pi pi-external-link"></i>
          </div>
          <h3>One-Click Shop</h3>
          <p>Revisit product pages instantly when you're ready to make a purchase.</p>
        </div>
      </div>

      <div class="note-box">
        <i class="pi pi-info-circle"></i>
        <span>Note: Automatic price fetching is currently unavailable.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1rem;
  text-align: center;
}

.gradient-text {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #a4c1ee, #5c6ef6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  font-family:'Times New Roman', Times, serif;
}

.subtitle {
  font-size: 1.4rem;
  color: var(--form-muted-text);
  /* margin-bottom: 3rem; */
}

.content-card {
  /* background: var(--surface-card, #ffffff); */
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: #cee1f6;
  color: #3B82F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}

.feature-item h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.feature-item p {
  font-size: 0.95rem;
  color: var(--form-muted-text);
  line-height: 1.4;
}

.note-box {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #cee1f6;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0;
}
</style>
