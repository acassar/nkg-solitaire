<script setup lang="ts">
import type { Card, Suit } from '@/models/Card'
import { useGameStateStore } from '@/stores/gameStateStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { gameState } = storeToRefs(useGameStateStore())

defineEmits<{
  (e: 'click'): void
  (e: 'dragStart', event: DragEvent): void
  (e: 'dragEnd'): void
  (e: 'drop', event: DragEvent): void
}>()

const props = defineProps<{
  card: Card
  beingDragged?: boolean
}>()

const suitStyles: Record<Suit, { icon: string }> = {
  spades: { icon: '🗡️' },
  hearts: { icon: '❤️' },
  diamonds: { icon: '💎' },
  clubs: { icon: '🍀' },
}

const canBeClicked = computed(() => {
  return (
    gameState.value.tableau.some((pile) => pile.cards.includes(props.card)) && props.card.faceUp
  )
})
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
        <div class="value">{{ card.value }}</div>
        <div>{{ suitStyles[card.suit!].icon }}</div>
      </div>

      <div class="row bottom-right">
        <div class="value">{{ card.value }}</div>
        <div>{{ suitStyles[card.suit!].icon }}</div>
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

.bottom-right {
  transform: rotate(180deg);
}

.value {
  font-size: 16px;
  font-weight: bold;
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.icon {
  font-size: 12px;
}

.dragging {
  opacity: 0.7;
}
</style>
