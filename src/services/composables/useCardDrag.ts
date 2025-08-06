import type { Card } from '@/models/Card'
import { ref } from 'vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { Tableau } from '@/models/Tableau'

export const useCardDrag = () => {
  const dragging = ref<Dragging>()

  const dragStart = (_event: DragEvent, card: Card, from: Pile) => {
    console.info('Drag started:', card, 'from:', from)
    dragging.value = {
      card: card,
      from: from,
    }

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

      if (target.isValidMove(dragging.value.card)) {
        const { card, from } = dragging.value
        console.info('Dropping card:', card, 'from:', from, 'to:', target)

        // Remove the card from the original pile
        const removedCard = from.removeCard(card.id)
        if (!removedCard) {
          console.error('Failed to remove card from source pile:', from)
          return
        }

        // Add the card to the target pile
        target.addCard(removedCard)

        //reveal the top card of the tableau if the source was a tableau
        if (dragging.value.from instanceof Tableau) {
          dragging.value.from.revealTopCard()
        }
        console.info('Card dropped successfully:', removedCard)
      } else {
        console.warn('Invalid move:', dragging.value.card, 'to', target)
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
