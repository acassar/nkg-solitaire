<script setup lang="ts">
import { useDragKey } from '@/constants/provideKeys'
import { Foundation } from '@/models/Foundation'
import { Score } from '@/models/Score'
import { useDragAndDrop } from '@/services/composables/dragAndDrop/useDragAndDrop'
import { type TUseDrag } from '@/services/composables/useCardDrag'
import { useGameStateStore } from '@/stores/gameStateStore'
import { storeToRefs } from 'pinia'
import { inject, onMounted, ref } from 'vue'
import Card from './card/CardComponent.vue'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

const gameStore = useGameStateStore()
const { scoreService } = storeToRefs(gameStore)

const props = defineProps<{
  foundation: Foundation
}>()

const foundationRef = ref<HTMLElement | null>(null)

const { handleCardMove, startCardDrag, dragging } = useDrag
const { registerDropZone } = useDragAndDrop()

const onHover = () => {
  if (!foundationRef.value) throw Error('Ref non montée')

  foundationRef.value.style.scale = '1.1'
}

const onStopHovering = () => {
  if (!foundationRef.value) throw Error('Ref non montée')
  foundationRef.value.style.scale = '1'
}

const onDrop = () => {
  handleCardMove(props.foundation)
  //TODO: handle multiple passes
  scoreService.value.addScore(Score.SCORES.TABLEAU_TO_FOUNDATION)
}

onMounted(() => {
  if (!foundationRef.value) throw Error('Ref non montée')
  registerDropZone({
    id: props.foundation.id,
    el: foundationRef.value,
    onHover: onHover,
    onDrop: onDrop,
    onStopHovering: onStopHovering,
  })
})
</script>

<template>
  <div ref="foundationRef" class="pile">
    <template v-if="foundation.cards.length > 0">
      <div
        v-for="(card, index) in foundation.cards"
        :key="card.id"
        class="card-container"
        :style="{ zIndex: index + 1 }"
      >
        <Card
          :can-be-clicked="true"
          :card="card"
          :can-be-dragged="true"
          :z-index="index + 1"
          :being-dragged="dragging?.cards.includes(card)"
          @drag-start="(e) => startCardDrag(card, foundation, e)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.pile {
  width: var(--card-width);
  height: var(--card-height);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;

  border: 2px dashed #34495e;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.pile:hover {
  border-color: #3498db;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.card-container {
  position: relative;
  z-index: 1;
}

.card-container:not(:first-child) {
  margin-top: -80px;
}
</style>
