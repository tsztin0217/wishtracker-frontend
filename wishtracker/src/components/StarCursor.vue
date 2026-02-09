<!-- Source: https://www.winterwind.com/tutorials/css/60 -->
<template>
  <span v-if="false"></span>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const handleMouseMove = (e) => {
  const arr = [1, 0.9, 0.8, 0.5, 0.2];
  const { clientX, clientY } = e;

  arr.forEach((i) => {
    const x = (1 - i) * 75;
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${clientY + Math.round(Math.random() * x - x / 2)}px`;
    star.style.left = `${clientX + Math.round(Math.random() * x - x / 2)}px`;
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
  position: fixed;
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
  text-shadow: 0 0 3px var(--star-glow-color);
}
.star:after {
  background: var(--star-fill-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
