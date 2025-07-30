<script setup lang="ts">
import Card from './CardComponent.vue'
import type { Card as CardType } from '@/models/Card'

defineProps<{
  cards: CardType[]
}>()
</script>

<template>
  <div class="pile">
    <Card
      v-for="card in cards"
      :key="card.id"
      :value="card.value"
      :suit="card.suit"
      :face-up="card.faceUp"
    />
  </div>
</template>

<style scoped>
.pile {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
