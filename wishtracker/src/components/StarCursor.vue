<!-- Source: https://www.winterwind.com/tutorials/css/60 -->
<template>
  <span v-if="false"></span>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const handleMouseMove = (e) => {
  const arr = [1, 0.9, 0.8, 0.5, 0.2];
  arr.forEach((i) => {
    const x = (1 - i) * 75;
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${e.pageY + Math.round(Math.random() * x - x / 2)}px`;
    star.style.left = `${e.pageX + Math.round(Math.random() * x - x / 2)}px`;
    document.body.appendChild(star);
    
    setTimeout(() => {
      if (star.parentNode) document.body.removeChild(star);
    }, Math.round(Math.random() * i * 600));
  });
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style>
.star {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}
.star:before, .star:after {
  position: absolute;
  top: 0; left: 0;
  content: '\2726';
  font-size: 9px;
}
.star:before {
  color: transparent;
  text-shadow: 0 0 3px rgb(206, 239, 255);
}
.star:after {
  background: rgb(246, 255, 252);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
