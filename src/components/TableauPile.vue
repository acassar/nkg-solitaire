<script setup lang="ts">
import { useCardDrag } from '@/services/useCardDrag'
import Card from './CardComponent.vue'
import type { Card as CardType } from '@/models/Card'
import { useGameStateStore } from '@/stores/gameStateStore'
import { storeToRefs } from 'pinia'

const { gameState } = storeToRefs(useGameStateStore())
const { drop } = useCardDrag(gameState)

defineProps<{
  cards: CardType[]
}>()
</script>

<template>
  <div class="pile">
    <div
      @dragover.prevent
      @drop="(e) => drop(e)"
      v-if="cards.length === 0"
      class="card empty"
    ></div>
    <div v-else class="card-container" v-for="card in cards" :key="card.id">
      <Card :card />
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
