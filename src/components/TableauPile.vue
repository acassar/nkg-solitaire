<script setup lang="ts">
import Card from './CardComponent.vue'
import type { Card as CardType } from '@/models/Card'

defineProps<{
  cards: CardType[]
}>()
</script>

<template>
  <div class="pile">
    <div class="card-container" v-for="card in cards" :key="card.id">
      <Card
        :value="card.value"
        :suit="card.suit"
        :face-up="card.faceUp"
        :can-be-clicked="card.faceUp"
      />
    </div>
  </div>
</template>

<style scoped>
.pile {
  display: flex;
  flex-direction: column;
}

.card-container {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  margin-bottom: -70px; /* Overlap cards */
}
</style>
