<script setup lang="ts">
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './card/CardComponent.vue'
import type { Foundation } from '@/models/Foundation'
import { inject } from 'vue'
import { useDragKey } from '@/constants/provideKeys'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

defineProps<{
  foundation: Foundation
}>()

const { drop } = useDrag
</script>

<template>
  <div class="pile" @dragover.prevent @drop="(e) => drop(e, foundation)">
    <template v-if="foundation.cards.length > 0">
      <div
        v-for="(card, index) in foundation.cards"
        :key="card.id"
        class="card-container"
        :style="{ zIndex: index + 1 }"
      >
        <Card :can-be-clicked="true" :card="card" />
      </div>
    </template>
    <div v-else class="card empty">×</div>
  </div>
</template>

<style scoped>
.pile {
  width: var(--card-width);
  height: var(--card-height);
  display: flex;
  flex-direction: column;
  position: relative;
}

.card-container {
  position: relative;
}

.card-container:not(:first-child) {
  margin-top: -80px;
}
</style>
