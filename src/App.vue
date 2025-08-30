<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <GameBoard />
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
