<script setup lang="ts">
import type { Card } from '@/models/Card'
import { useDragAndDrop } from '@/services/composables/dragAndDrop/useDragAndDrop'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CardRow from './components/CardRow.vue'

const { registerDropZone, unregisterDropZone } = useDragAndDrop()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'dragStart', event: PointerEvent): void
  (e: 'drop'): void
}>()
const elementRef = ref<HTMLElement | null>(null)

const props = defineProps<{
  card: Card
  zIndex?: number
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
      { canBeClicked: canBeClicked },
      { dragging: beingDragged },
    ]"
    :style="{ zIndex: beingDragged ? 1000 : zIndex }"
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
  border: 1px solid #ddd;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  font-weight: bold;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  transform: scale(1.2);
  transform: translateY(-10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.faceDown {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: transparent;
  border: 2px solid #34495e;
}

.faceUp {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
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
  position: relative;
}
</style>
