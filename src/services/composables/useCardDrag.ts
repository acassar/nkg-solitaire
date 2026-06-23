import type { Card } from '@/models/Card'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { useGameStateStore } from '@/stores/gameStateStore'
import { ref } from 'vue'
import { processMoveHandlers } from '../moveHandlers'
import { useDragAndDrop } from './dragAndDrop/useDragAndDrop'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()
  const { startDrag } = useDragAndDrop({ dragEndCallback: () => stopCardDrag() })
  const { scoreService } = useGameStateStore()

  const startCardDrag = (card: Card, from: Pile, event: PointerEvent) => {
    const stackedCards = from.getStackedCards(card.id)

    dragging.value = {
      cards: stackedCards,
      from: from,
    }

    const cardElementsToDrag: HTMLElement[] = []
    stackedCards.forEach((card) => {
      const cardElement = document.getElementById(card.id)
      if (cardElement) {
        cardElementsToDrag.push(cardElement)
      }
    })

    startDrag(event, cardElementsToDrag)
  }

  const stopCardDrag = () => {
    dragging.value = undefined
  }

  // Main drop handler — returns true if the move was successfully executed
  const handleCardMove = (target: Pile): boolean => {
    let success = false
    try {
      if (!dragging.value) return false

      const { from, cards } = dragging.value
      const result = processMoveHandlers(from, target, cards)
      if (result === true) {
        scoreService.incrementMoves()
        success = true
      }
    } finally {
      dragging.value = undefined
    }
    return success
  }

  return {
    startCardDrag,
    stopCardDrag,
    handleCardMove,
    dragging,
  }
}

export type TUseDrag = ReturnType<typeof useCardDrag>
