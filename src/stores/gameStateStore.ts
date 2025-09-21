import { ref } from 'vue'
import { defineStore } from 'pinia'
import { initDevGame, initGame, type GameState } from '@/utils/initGame'
import { Score } from '@/models/Score'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initDevGame())
  const scoreService = ref<Score>(new Score())

  const startNewGame = () => {
    gameState.value = initGame()
    scoreService.value.reset()
  }

  const incrementMoves = () => {
    scoreService.value.incrementMoves()
  }

  const addScore = (points: number) => {
    scoreService.value.addScore(points)
  }

  const getStats = () => {
    return scoreService.value.getStats(gameState.value)
  }

  return { 
    gameState, 
    scoreService,
    startNewGame,
    incrementMoves,
    addScore,
    getStats
  }
})
