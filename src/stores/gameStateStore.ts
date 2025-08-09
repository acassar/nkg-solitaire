import { ref } from 'vue'
import { defineStore } from 'pinia'
import { initDevGame, type GameState } from '@/utils/initGame'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initDevGame())

  return { gameState }
})
