<script setup lang="ts">
import { useDragKey } from '@/constants/provideKeys'
import type { Tableau } from '@/models/Tableau'
import { useDragAndDrop } from '@/services/composables/dragAndDrop/useDragAndDrop'
import { type TUseDrag } from '@/services/composables/useCardDrag'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import Card from './card/CardComponent.vue'
import type { Card as CardModel } from '@/models/Card'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

const props = defineProps<{
  tableau: Tableau
}>()

const tableauRef = ref<HTMLDivElement>()

const { startCardDrag, dragging, handleCardMove } = useDrag
const { registerDropZone, unregisterDropZone } = useDragAndDrop()

const handleDrop = () => {
  handleCardMove(props.tableau)
}

const handleDragStart = (selectedCard: CardModel, tableau: Tableau, event: PointerEvent) => {
  startCardDrag(selectedCard, tableau, event)
}


onMounted(() => {
  if (!tableauRef.value) throw Error('Ref non montée')
  registerDropZone({
    id: props.tableau.id,
    el: tableauRef.value,
    onHover: onHover,
    onDrop: () => handleCardMove(props.tableau),
    onStopHovering: onStopHovering,
  })
})

onBeforeUnmount(() => {
  unregisterDropZone(props.tableau.id)
})

const onHover = () => {
  if (!tableauRef.value) throw Error('Ref non montée')

  tableauRef.value.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
}

const onStopHovering = () => {
  if (!tableauRef.value) throw Error('Ref non montée')
  tableauRef.value.style.backgroundColor = 'transparent'
}
</script>

<template>
  <div ref="tableauRef" class="pile">
    <div v-if="tableau.cards.length === 0" class="card empty" @dragover.prevent></div>
    <div
      v-else
      class="card-container"
      v-for="(card, index) in tableau.cards"
      :key="card.id"
    >
      <Card
        :card
        :being-dragged="dragging?.cards.includes(card)"
        :key="card.id"
        :can-be-dragged="card.faceUp"
        :is-drop-zone="card.faceUp && !dragging?.cards.includes(card)"
        :z-index="index + 1"
        @drag-start="(e) => handleDragStart(card, tableau, e)"
        @drop="handleDrop()"
      />
    </div>
  </div>
</template>

<style scoped>
.pile {
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
  min-height: var(--card-height);
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pile:hover {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(var(--card-width) * 1.1);
  height: var(--card-height);
  margin-bottom: calc(-1 * var(--card-overlap));
}

/* Last card must not have a negative margin so the pile expands to contain it */
.card-container:last-child {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .pile {
    padding: 0.25rem;
  }

  .card-container {
    width: var(--card-width);
  }
}
</style>
