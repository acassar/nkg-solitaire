import type { Card } from '@/models/Card'
import { ref } from 'vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import type { Dragging } from '@/models/Drag'
import type { Pile } from '@/models/Pile'
import { Tableau } from '@/models/Tableau'
import { moveCardFromTableauToTableau } from '../tableauService'

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

      if (target instanceof Tableau) {
        moveCardFromTableauToTableau(dragging.value.from as Tableau, target, dragging.value.card)
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
