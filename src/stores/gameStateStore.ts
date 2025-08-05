import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type GameState, initGame } from '@/utils/initGame'
import type { Card } from '@/models/Card'

export const useGameStateStore = defineStore('gameState', () => {
  const gameState = ref<GameState>(initGame())

  const draggingCard = ref<Card>()

  const setDraggingCard = (card: Card | undefined) => {
    draggingCard.value = card
  }

  return { gameState, draggingCard, setDraggingCard }
})
