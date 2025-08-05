<script setup lang="ts">
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './CardComponent.vue'
import { inject } from 'vue'
import { useDragKey } from '@/constants/provideKeys'
import type { Tableau } from '@/models/Tableau'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}
const { dragStart, drop, dragEnd } = useDrag

defineProps<{
  tableau: Tableau
}>()
</script>

<template>
  <div class="pile">
    <div
      v-if="tableau.cards.length === 0"
      class="card empty"
      @dragover.prevent
      @drop="(e) => drop(e, tableau)"
    ></div>
    <div v-else class="card-container" v-for="card in tableau.cards" :key="card.id">
      <Card
        :card
        @drag-start="dragStart($event, card, tableau)"
        @drag-end="dragEnd"
        @drop="(e) => drop(e, tableau)"
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
