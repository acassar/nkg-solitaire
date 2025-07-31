<script setup lang="ts">
import type { Suit } from '@/models/Card'

defineProps<{
  value?: number
  suit?: Suit
  faceUp: boolean
  canBeClicked?: boolean
}>()

const suitStyles: Record<Suit, { icon: string }> = {
  spades: { icon: '🗡️' },
  hearts: { icon: '❤️' },
  diamonds: { icon: '💎' },
  clubs: { icon: '🍀' },
}
</script>

<template>
  <div
    :class="['card', { faceUp, faceDown: !faceUp }, { canBeClicked: canBeClicked }]"
    @click="canBeClicked ? $emit('click') : null"
  >
    <template v-if="faceUp">
      <div class="row">
        <div class="value">{{ value }}</div>
        <div>{{ suitStyles[suit!].icon }}</div>
      </div>

      <div class="row bottom-right">
        <div class="value">{{ value }}</div>
        <div>{{ suitStyles[suit!].icon }}</div>
      </div>
    </template>
    <template v-else> 🂠 </template>
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
</style>
