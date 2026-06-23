import type { Card } from '@/models/Card'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { Score } from '@/models/Score'
import { useGameStateStore } from '@/stores/gameStateStore'
import { ref } from 'vue'
import { processMoveHandlers } from '../moveHandlers'
import { useDragAndDrop } from './dragAndDrop/useDragAndDrop'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()
  const { startDrag } = useDragAndDrop({ dragEndCallback: () => stopCardDrag() })
  const store = useGameStateStore()
  const { scoreService } = store

  const stopCardDrag = () => {
    dragging.value = undefined
  }

  const autoMoveToFoundation = (card: Card, from: Pile): boolean => {
    // Prefer foundation
    const foundationTarget = store.gameState.foundations.find((f) => f.isValidMove(card))
    if (foundationTarget) {
      const result = processMoveHandlers(from, foundationTarget, [card])
      if (result === true) {
        scoreService.incrementMoves()
        scoreService.addScore(Score.SCORES.TABLEAU_TO_FOUNDATION)
        return true
      }
    }

    // Fall back to any valid tableau pile (move entire stack)
    const stackedCards = from.getStackedCards(card.id)
    const tableauTarget = store.gameState.tableau.find((t) => t !== from && t.isValidMove(card))
    if (tableauTarget) {
      const result = processMoveHandlers(from, tableauTarget, stackedCards)
      if (result === true) {
        scoreService.incrementMoves()
        return true
      }
    }

    return false
  }

  const lastDragStartTime = new Map<string, number>()

  const startCardDrag = (card: Card, from: Pile, event: PointerEvent) => {
    const now = Date.now()
    const last = lastDragStartTime.get(card.id) ?? 0

    if (now - last < 300) {
      lastDragStartTime.delete(card.id)
      autoMoveToFoundation(card, from)
      return
    }

    lastDragStartTime.set(card.id, now)

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
    autoMoveToFoundation,
    dragging,
  }
}

export type TUseDrag = ReturnType<typeof useCardDrag>
