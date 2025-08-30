<script setup lang="ts">
import type { Card } from '@/models/Card'
import CardRow from './components/CardRow.vue'
import { useDragAndDrop } from '@/services/composables/dragAndDrop/useDragAndDrop'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { registerDropZone, unregisterDropZone } = useDragAndDrop()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'dragStart', event: PointerEvent): void
  (e: 'drop'): void
}>()
const elementRef = ref<HTMLElement | null>(null)

const props = defineProps<{
  card: Card
  beingDragged?: boolean
  canBeClicked?: boolean
  canBeDragged?: boolean
  isDropZone?: boolean
}>()

function onPointerDown(e: PointerEvent) {
  if (elementRef.value && props.canBeDragged) {
    emit('dragStart', e)
  }
}

function onHover() {
  elementRef.value?.classList.add('hover')
}

function onStopHovering() {
  elementRef.value?.classList.remove('hover')
}

const handleDropZone = () => {
  if (props.isDropZone && elementRef.value) {
    registerDropZone({
      id: props.card.id,
      el: elementRef.value,
      onDrop: () => emit('drop'),
      onHover: onHover,
      onStopHovering: onStopHovering,
    })
  } else {
    unregisterDropZone(props.card.id)
  }
}

onMounted(() => {
  handleDropZone()
})

onBeforeUnmount(() => handleDropZone())

watch(
  () => props.isDropZone,
  () => {
    handleDropZone()
  },
)
</script>

<template>
  <div
    ref="elementRef"
    :id="card.id"
    :class="[
      'card',
      { faceUp: card.faceUp, faceDown: !card.faceUp },
      { canBeDragged: canBeDragged },
      { dragging: beingDragged },
    ]"
    @click="canBeClicked ? $emit('click') : null"
    @pointerdown="onPointerDown"
  >
    <template v-if="card.faceUp">
      <div class="row">
        <CardRow :card="card" />
      </div>

      <div class="reversed-row bottom-right">
        <CardRow :card="card" />
      </div>
    </template>
    <template v-else> {{ card.faceUp }} </template>
  </div>
</template>

<style scoped>
.card {
  width: var(--card-width);
  height: var(--card-height);
  border: 1px solid #aaa;
  border-radius: 4px;
  background-color: white;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card.hover {
  border: 1px solid #000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.canBeClicked:hover {
  cursor: pointer;
}

.canBeDragged:hover {
  cursor: pointer;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.faceDown {
  background-color: #444;
  color: transparent;
}
.faceUp {
  background-color: white;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
}

.reversed-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  transform: rotate(180deg);
}

.bottom-right {
  transform: rotate(180deg);
}

.dragging {
  opacity: 0.7;
  z-index: 1000;
  position: relative;
}
</style>
