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
  const { startDrag } = useDragAndDrop({
    dragEndCallback: () => stopCardDrag(),
    clickCallback: () => {
      if (dragging.value) {
        autoMoveToFoundation(dragging.value.cards[0], dragging.value.from)
      }
    },
  })
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

  const startCardDrag = (card: Card, from: Pile, event: PointerEvent) => {
    const stackedCards = from.getStackedCards(card.id)

    const cardElementsToDrag = stackedCards
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el)

    if (!startDrag(event, cardElementsToDrag)) return

    dragging.value = { cards: stackedCards, from }
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
