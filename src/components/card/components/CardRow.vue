<script setup lang="ts">
import type { Card, Suit } from '@/models/Card'
import { defineProps } from 'vue'

defineProps<{
  card: Card
}>()

const suitStyles: Record<Suit, { icon: string; color: string }> = {
  spades: { icon: '♠', color: 'black' },
  hearts: { icon: '♥', color: 'red' },
  diamonds: { icon: '♦', color: 'red' },
  clubs: { icon: '♣', color: 'black' },
}
</script>

<template>
  <div class="value">{{ card.getValueString() }}</div>
  <div class="icon" :style="{ color: suitStyles[card.suit!].color }">
    {{ suitStyles[card.suit!].icon }}
  </div>
</template>

<style scoped>
.value {
  font-size: 16px;
  font-weight: bold;
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.icon {
  font-size: 22px;
  font-weight: bold;
}
</style>
