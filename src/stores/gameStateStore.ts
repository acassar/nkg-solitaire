import { Score } from '@/models/Score'
import { initDevGame, initGame, type GameState } from '@/utils/initGame'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initDevGame())
  const scoreService = ref<Score>(new Score())

  const startNewGame = () => {
    gameState.value = initGame()
    scoreService.value.reset()
  }

  const gameStats = computed(() => scoreService.value.getStats(gameState.value))

  return {
    gameState,
    scoreService,
    startNewGame,
    gameStats,
  }
})
