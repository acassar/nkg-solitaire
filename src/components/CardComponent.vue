<script setup lang="ts">
defineProps<{
  value?: number
  suit?: string
  faceUp: boolean
  canBeClicked?: boolean
}>()

function getSuitSymbol(suit: string): string {
  return (
    {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    }[suit] || '?'
  )
}
</script>

<template>
  <div
    :class="['card', { faceUp, faceDown: !faceUp }, { canBeClicked: canBeClicked }]"
    @click="canBeClicked ? $emit('click') : null"
  >
    <template v-if="faceUp"> {{ value }} {{ getSuitSymbol(suit ?? '') }} </template>
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
  text-align: center;
  line-height: var(--card-height);
  font-weight: bold;
  font-size: 18px;
  user-select: none;
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
  color: black;
}
</style>
