import type { Card } from '@/models/Card'
import { ref } from 'vue'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { Tableau } from '@/models/Tableau'
import { moveStackedCardsFromTableauToTableau } from '../tableauService'
import { Foundation } from '@/models/Foundation'
import { moveStackedCardsFromTableauToFoundation } from '../foundationService'

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

  const drop = (_event: DragEvent, target: Pile) => {
    console.info('Drop event:', target)
    try {
      if (!dragging.value) {
        console.warn('No card is being dragged')
        return
      }

      if (target instanceof Tableau) {
        if (!target.isValidMove(dragging.value.cards[0])) {
          return
        }

        // Check that the source is actually a Tableau
        if (!(dragging.value.from instanceof Tableau)) {
          console.warn('Cannot move from non-Tableau to Tableau')
          return
        }

        moveStackedCardsFromTableauToTableau(dragging.value.from, target, dragging.value.cards)
      }

      if (target instanceof Foundation) {
        if (!target.isValidMove(dragging.value.cards[0])) {
          return
        }

        // Check that the source is actually a Tableau
        if (!(dragging.value.from instanceof Tableau)) {
          console.warn('Cannot move from non-Tableau to Foundation')
          return
        }

        moveStackedCardsFromTableauToFoundation(dragging.value.from, target, dragging.value.cards)
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
