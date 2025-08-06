<script setup lang="ts">
import Card from './card/CardComponent.vue'
import type { Card as CardType } from '@/models/Card'

defineProps<{
  drawPile: CardType[]
  discardPile: CardType[]
}>()
</script>

<template>
  <div class="stock">
    <Card :card="drawPile[0]" v-if="drawPile.length > 0" />
    <div v-else class="card empty">×</div>

    <Card v-if="discardPile.length > 0" :card="discardPile.at(-1)!" />
    <div v-else class="card empty">×</div>
  </div>
</template>

<style scoped>
.stock {
  display: flex;
  gap: 1rem;
}
</style>
