import type { Card } from '@/models/Card'
import { ref } from 'vue'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { processMoveHandlers } from '../moveHandlers'
import { useDragAndDrop } from './dragAndDrop/useDragAndDrop'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()
  const { startDrag } = useDragAndDrop({ dragEndCallback: () => dragEnd() })

  const dragStart = (card: Card, from: Pile, event: PointerEvent) => {
    console.info('Drag started:', card, 'from:', from)

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
    if (!card) return
  }

  const dragEnd = () => {
    console.info('Drag ended')
    dragging.value = undefined
  }

  // Main drop handler
  const drop = (target: Pile) => {
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
