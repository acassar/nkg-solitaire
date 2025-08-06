<script setup lang="ts">
import Card from './card/CardComponent.vue'
import type { Card as CardType } from '@/models/Card'
import { storeToRefs } from 'pinia'
import { useGameStateStore } from '@/stores/gameStateStore'
import { computed } from 'vue'

defineProps<{
  drawPile: CardType[]
  discardPile: CardType[]
}>()

const { gameState } = storeToRefs(useGameStateStore())
const stock = computed(() => gameState.value.stock)

const drawCard = () => {
  if (stock.value.drawPile.length === 0) handleLastCardDrawn()

  const card = stock.value.drawPile.shift()
  if (card) {
    card.faceUp = true
    stock.value.discardPile.push(card)
  }
}

const handleLastCardDrawn = () => {
  stock.value.drawPile = stock.value.discardPile
  stock.value.discardPile = []
  stock.value.drawPile.forEach((card) => (card.faceUp = false))
}
</script>

<template>
  <div class="stock" @click="drawCard">
    <div class="draw-pile">
      <Card :card="drawPile[0]" v-if="drawPile.length > 0" />
      <div v-else class="card empty">×</div>
    </div>

    <div class="discard-pile">
      <template v-if="discardPile.length > 0">
        <div v-for="card in discardPile.slice(-3)" :key="card.id" class="card-container">
          <Card :card="card" />
        </div>
      </template>
      <div v-else class="card empty">×</div>
    </div>
  </div>
</template>

<style scoped>
.stock {
  display: flex;
  gap: 1rem;
}

.draw-pile {
  width: var(--card-width);
  height: var(--card-height);
}

.discard-pile {
  width: var(--card-width);
  height: var(--card-height);
  position: relative;
}

.card-container {
  position: relative;
}

.card-container:not(:first-child) {
  margin-top: -70px;
}
</style>
