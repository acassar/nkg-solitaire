<script setup lang="ts">
import Card from './CardComponent.vue'
import type { Card as CardType } from '@/models/Card'

defineProps<{
  cards: CardType[]
}>()
</script>

<template>
  <div class="pile">
    <Card v-if="cards.length > 0" :card="cards.at(-1)!" />
    <div v-else class="card empty">×</div>
  </div>
</template>

<style scoped>
.pile {
  width: var(--card-width);
  height: var(--card-height);
}
</style>
