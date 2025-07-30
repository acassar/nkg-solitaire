<script setup lang="ts">
import Card from './CardComponent.vue'
import type { Card as CardType } from '@/models/Card'

defineProps<{
  drawPile: CardType[]
  discardPile: CardType[]
}>()
</script>

<template>
  <div class="stock">
    <Card :face-up="false" v-if="drawPile.length > 0" />
    <div v-else class="card empty">×</div>

    <Card
      v-if="discardPile.length > 0"
      :value="discardPile.at(-1)?.value"
      :suit="discardPile.at(-1)?.suit"
      :face-up="true"
    />
    <div v-else class="card empty">×</div>
  </div>
</template>

<style scoped>
.stock {
  display: flex;
  gap: 1rem;
}
</style>
