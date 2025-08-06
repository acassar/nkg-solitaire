import { ref } from 'vue'
import { defineStore } from 'pinia'
import { initGame, type GameState } from '@/utils/initGame'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initGame())

  return { gameState }
})
