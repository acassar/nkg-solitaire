<script setup lang="ts">
import { inject } from 'vue'
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './CardComponent.vue'
import { useDragKey } from '@/constants/provideKeys'
import type { Tableau } from '@/models/Tableau'
import { useMouse } from '@vueuse/core'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}
const { dragStart, drop, dragEnd, dragging } = useDrag
const { x, y } = useMouse()

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
        :being-dragged="dragging?.cards.includes(card)"
        :key="card.id"
        @drag-start="dragStart($event, card, tableau)"
        @drag-end="dragEnd"
        @drop="(e) => drop(e, tableau)"
      />
    </div>
  </div>

  <!-- Floating preview -->
  <div
    v-if="dragging"
    :style="{
      position: 'fixed',
      left: x + 'px',
      top: y + 'px',
      pointerEvents: 'none',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      v-for="(card, idx) in dragging.cards"
      :key="card.id"
      :style="{
        position: 'absolute',
        top: idx * 30 + 'px', // 30px overlap
        left: '0px',
        zIndex: idx,
        pointerEvents: 'none',
      }"
    >
      <Card :card="card" :beingDragged="true" />
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
