import type { Card } from '@/models/Card'
import { ref } from 'vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import type { Drag } from '@/models/Drag'
import type { Pile } from '@/models/Pile'

export const useCardDrag = () => {
  const dragging = ref<Drag>()

  const dragStart = (_event: DragEvent, card: Card, from: Pile) => {
    console.info('Drag started:', card, 'from:', from)
    dragging.value = {
      dragging: card,
      DraggingFrom: from,
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
  }

  return {
    dragStart,
    dragEnd,
    drop,
  }
}

export type TUseDrag = ReturnType<typeof useCardDrag>
