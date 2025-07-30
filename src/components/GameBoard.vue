<script setup lang="ts">
import { ref } from 'vue'
import { initGame } from '@/utils/initGame'
import type { GameState } from '@/utils/initGame'

const gameState = ref<GameState>(initGame())

function getSuitSymbol(suit: string): string {
  return (
    {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    }[suit] || '?'
  )
}
</script>

<template>
  <div class="game-board">
    <div class="tableau">
      <div class="pile" v-for="(pile, colIndex) in gameState.tableau" :key="colIndex">
        <div
          class="card"
          v-for="card in pile.cards"
          :key="card.id"
          :class="{ faceUp: card.faceUp, faceDown: !card.faceUp }"
        >
          <template v-if="card.faceUp"> {{ card.value }} {{ getSuitSymbol(card.suit) }} </template>
          <template v-else> 🂠 </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.tableau {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.pile {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card {
  width: 60px;
  height: 90px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background-color: white;
  text-align: center;
  line-height: 90px;
  font-weight: bold;
  font-size: 18px;
  user-select: none;
}

.card.faceDown {
  background-color: #444;
  color: transparent;
}

.card.faceUp {
  background-color: white;
  color: black;
}
</style>
