import type { Card } from '@/models/Card'
import { ref } from 'vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { Tableau } from '@/models/Tableau'
import { moveStackedCardsFromTableauToTableau } from '../tableauService'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()

  const dragStart = (_event: DragEvent, card: Card, from: Pile) => {
    console.info('Drag started:', card, 'from:', from)

    const stackedCards = from.getStackedCards(card.id)

    dragging.value = {
      cards: stackedCards,
      from: from,
    }

    console.log(stackedCards)
    if (!card) return
  }

  const dragEnd = () => {
    console.info('Drag ended')
    const { setDraggingCard } = useGameStateStore()
    setDraggingCard(undefined)
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
        moveStackedCardsFromTableauToTableau(
          dragging.value.from as Tableau,
          target,
          dragging.value.cards,
        )
      }
    } finally {
      dragging.value = undefined
    }
  }

  return {
    dragStart,
    dragEnd,
    drop,
  }
}

export type TUseDrag = ReturnType<typeof useCardDrag>
