<script setup lang="ts">
import Stock from './StockComponent.vue'
import FoundationPile from './FoundationPile.vue'
import TableauPile from './TableauPile.vue'
import { storeToRefs } from 'pinia'
import { useGameStateStore } from '@/stores/gameStateStore'
import { useCardDrag } from '@/services/composables/useCardDrag'
import { useDragKey } from '@/constants/provideKeys'
import { provide } from 'vue'

const { gameState } = storeToRefs(useGameStateStore())
const useDrag = useCardDrag()

provide(useDragKey, useDrag)
</script>

<template>
  <div class="game-board">
    <div class="top-row">
      <Stock v-model="gameState.stock" />

      <div class="foundations">
        <FoundationPile v-for="(pile, i) in gameState.foundations" :key="i" :foundation="pile" />
      </div>
    </div>

    <div class="tableau">
      <TableauPile v-for="(pile, i) in gameState.tableau" :key="i" :tableau="pile" />
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.top-row {
  display: flex;
  justify-content: space-around;
}

.foundations {
  display: flex;
  gap: 1rem;
}

.tableau {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
