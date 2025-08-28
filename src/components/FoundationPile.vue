<script setup lang="ts">
import { type TUseDrag } from '@/services/composables/useCardDrag'
import Card from './card/CardComponent.vue'
import { Foundation } from '@/models/Foundation'
import { inject, onMounted, ref } from 'vue'
import { useDragKey } from '@/constants/provideKeys'
import { useDragAndDrop } from '@/services/composables/dragAndDrop/useDragAndDrop'
import { v4 } from 'uuid'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

const props = defineProps<{
  foundation: Foundation
}>()

const foundationRef = ref<HTMLElement | null>(null)

const { drop, dragStart, dragEnd } = useDrag
const { registerDropZone } = useDragAndDrop()

const onHover = () => {
  if (!foundationRef.value) throw Error('Ref non montée')

  foundationRef.value.style.backgroundColor = 'grey'
}

const onStopHovering = () => {
  if (!foundationRef.value) throw Error('Ref non montée')
  foundationRef.value.style.backgroundColor = ''
}

onMounted(() => {
  if (!foundationRef.value) throw Error('Ref non montée')
  registerDropZone({
    id: v4(),
    el: foundationRef.value,
    onHover: onHover,
    onDrop: () => drop(props.foundation),
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
          @drag-start="dragStart(card, foundation)"
          @drag-end="dragEnd"
        />
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
