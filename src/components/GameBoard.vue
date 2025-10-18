<script setup lang="ts">
import { useDragKey } from '@/constants/provideKeys'
import { useCardDrag } from '@/services/composables/useCardDrag'
import { useGameStateStore } from '@/stores/gameStateStore'
import { storeToRefs } from 'pinia'
import { provide } from 'vue'
import FoundationPile from './FoundationPile.vue'
import GameCompletion from './GameCompletion.vue'
import GameHelp from './GameHelp.vue'
import GameStats from './GameStats.vue'
import Stock from './StockComponent.vue'
import TableauPile from './TableauPile.vue'

const gameStore = useGameStateStore()
const { gameState } = storeToRefs(gameStore)
const useDrag = useCardDrag()

provide(useDragKey, useDrag)

const startNewGame = () => {
  gameStore.startNewGame()
}
</script>

<template>
  <div id="game-board">
    <GameCompletion />

    <div class="game-header">
      <h1 class="game-title">Solitaire</h1>
      <div class="header-controls">
        <GameStats />
        <GameHelp />
        <button @click="startNewGame" class="new-game-btn">Nouvelle Partie</button>
      </div>
    </div>

    <div class="top-row">
      <Stock v-model="gameState.stock" />

      <div class="foundations">
        <FoundationPile v-for="(pile, i) in gameState.foundations" :key="i" :foundation="pile" />
      </div>
    </div>

    <div class="center-area">
      <div class="tableau">
        <TableauPile v-for="(pile, i) in gameState.tableau" :key="i" :tableau="pile" />
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 1rem;
  gap: 1rem;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  margin-bottom: 1rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.game-title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.new-game-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.new-game-btn:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.new-game-btn:active {
  transform: translateY(0);
}

.top-row {
  display: flex;
  justify-content: space-around;
  height: calc((var(--card-height) - var(--card-overlap)) * 14);
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

.center-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex: 1;
}
</style>
