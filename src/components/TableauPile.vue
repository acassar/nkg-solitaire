<script setup lang="ts">
import { inject, ref } from 'vue'
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './card/CardComponent.vue'
import { useDragKey } from '@/constants/provideKeys'
import type { Tableau } from '@/models/Tableau'
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

const handleDrop = () => {
  handleCardMove(props.tableau)
}

const handleDragStart = (selectedCard: CardModel, tableau: Tableau, event: PointerEvent) => {
  startCardDrag(selectedCard, tableau, event)
}
</script>

<template>
  <div ref="tableauRef" class="pile">
    <div v-if="tableau.cards.length === 0" class="card empty" @dragover.prevent></div>
    <div v-else class="card-container" v-for="(card, index) in tableau.cards" :key="card.id">
      <Card
        :card
        :being-dragged="dragging?.cards.includes(card)"
        :key="card.id"
        :can-be-dragged="card.faceUp"
        :is-drop-zone="card.faceUp && !dragging?.cards.includes(card)"
        :z-index="index"
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
}

.card-container {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  margin-bottom: -70px; /* Overlap cards */
}
</style>
