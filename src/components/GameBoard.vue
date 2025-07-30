<script setup lang="ts">
import { ref } from 'vue'
import { initGame } from '@/utils/initGame'
import type { GameState } from '@/utils/initGame'

import Stock from './StockComponent.vue'
import FoundationPile from './FoundationPile.vue'
import TableauPile from './TableauPile.vue'

const gameState = ref<GameState>(initGame())
</script>

<template>
  <div class="game-board">
    <div class="top-row">
      <Stock :draw-pile="gameState.stock.drawPile" :discard-pile="gameState.stock.discardPile" />

      <div class="foundations">
        <FoundationPile v-for="(pile, i) in gameState.foundations" :key="i" :cards="pile.cards" />
      </div>
    </div>

    <div class="tableau">
      <TableauPile v-for="(pile, i) in gameState.tableau" :key="i" :cards="pile.cards" />
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
