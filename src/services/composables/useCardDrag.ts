import type { Card } from '@/models/Card'
import { ref } from 'vue'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { processMoveHandlers } from '../moveHandlers'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()

  const dragStart = (_event: DragEvent, card: Card, from: Pile) => {
    console.info('Drag started:', card, 'from:', from)

    const stackedCards = from.getStackedCards(card.id)

    _event.dataTransfer?.setDragImage(new Image(), 0, 0) // Hide default drag image

    dragging.value = {
      cards: stackedCards,
      from: from,
    }

    console.log(stackedCards)
    if (!card) return
  }

  const dragEnd = () => {
    console.info('Drag ended')
    dragging.value = undefined
  }

  // Main drop handler
  const drop = (_event: DragEvent, target: Pile) => {
    console.info('Drop event:', target)
    try {
      if (!dragging.value) {
        console.warn('No card is being dragged')
        return
      }

      const { from, cards } = dragging.value

      // Process the move using all available handlers
      if (!processMoveHandlers(from, target, cards)) {
        console.warn('Unsupported move type:', from.constructor.name, 'to', target.constructor.name)
      }
    } finally {
      dragging.value = undefined
    }
  }

  return {
    dragStart,
    dragEnd,
    drop,
    dragging,
  }
}

export type TUseDrag = ReturnType<typeof useCardDrag>
