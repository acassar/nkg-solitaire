import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type GameState, initDevGame } from '@/utils/initGame'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initDevGame())

  return { gameState }
})
