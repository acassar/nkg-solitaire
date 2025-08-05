import type { Card } from '@/models/Card'
import type { GameState } from '@/utils/initGame'
import { type Ref } from 'vue'
import { moveCardFromTableau } from './cardService'
import { useGameStateStore } from '@/stores/gameStateStore'

export const useCardDrag = (gameState: Ref<GameState>) => {
  const dragStart = (_event: DragEvent, card: Card) => {
    const { setDraggingCard } = useGameStateStore()
    setDraggingCard(card)

    if (!card) return
  }

  const dragEnd = () => {
    const { setDraggingCard } = useGameStateStore()
    setDraggingCard(undefined)
  }

  const drop = (_event: DragEvent, targetCardId: string | null = null) => {
    const { draggingCard } = useGameStateStore()

    moveCardFromTableau(gameState.value, draggingCard!, targetCardId)
  }

  return {
    dragStart,
    dragEnd,
    drop,
  }
}
