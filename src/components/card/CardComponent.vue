<script setup lang="ts">
import type { Card } from '@/models/Card'
import CardRow from './components/CardRow.vue'

defineEmits<{
  (e: 'click'): void
  (e: 'dragStart', event: DragEvent): void
  (e: 'dragEnd'): void
  (e: 'drop', event: DragEvent): void
}>()

defineProps<{
  card: Card
  beingDragged?: boolean
  canBeClicked: boolean
}>()
</script>

<template>
  <div
    :class="[
      'card',
      { faceUp: card.faceUp, faceDown: !card.faceUp },
      { canBeClicked: canBeClicked },
      { dragging: beingDragged },
    ]"
    @click="canBeClicked ? $emit('click') : null"
    @dragstart="canBeClicked ? $emit('dragStart', $event) : null"
    :draggable="canBeClicked"
    @dragend="$emit('dragEnd')"
    @dragover.prevent
    @drop="(e) => $emit('drop', e)"
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
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.canBeClicked:hover {
  cursor: pointer;
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
}
</style>
