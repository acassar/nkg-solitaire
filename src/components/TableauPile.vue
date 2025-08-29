<script setup lang="ts">
import { inject, ref } from 'vue'
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './card/CardComponent.vue'
import { useDragKey } from '@/constants/provideKeys'
import type { Tableau } from '@/models/Tableau'

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

const { dragStart, dragEnd, dragging, drop } = useDrag

const handleDragEnd = () => {
  dragEnd()
}

const handleDrop = () => {
  drop(props.tableau)
}
</script>

<template>
  <div ref="tableauRef" class="pile">
    <div v-if="tableau.cards.length === 0" class="card empty" @dragover.prevent></div>
    <div v-else class="card-container" v-for="card in tableau.cards" :key="card.id">
      <Card
        :card
        :being-dragged="dragging?.cards.includes(card)"
        :key="card.id"
        :can-be-dragged="card.faceUp"
        :is-drop-zone="card.faceUp && !dragging?.cards.includes(card)"
        @drag-start="dragStart(card, tableau)"
        @drag-end="handleDragEnd()"
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
