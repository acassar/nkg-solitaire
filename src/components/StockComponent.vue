<script setup lang="ts">
import { useDragKey } from '@/constants/provideKeys'
import type { DiscardPile } from '@/models/DiscardPile'
import type { DrawPile } from '@/models/DrawPile'
import type { TUseDrag } from '@/services/composables/useCardDrag'
import { inject } from 'vue'
import Card from './card/CardComponent.vue'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

const stock = defineModel<{ drawPile: DrawPile; discardPile: DiscardPile }>({ required: true })

const { startCardDrag, dragging } = useDrag

const drawCard = () => {
  if (stock.value.drawPile.cards.length === 0) handleLastCardDrawn()

  const card = stock.value.drawPile.cards.pop()
  if (card) {
    card.faceUp = true
    stock.value.discardPile.cards.push(card)
  }
}

const handleLastCardDrawn = () => {
  stock.value.drawPile.cards = stock.value.discardPile.cards
  stock.value.discardPile.cards = []
  stock.value.drawPile.cards.forEach((card) => (card.faceUp = false))
}
</script>

<template>
  <div class="stock">
    <div class="draw-pile" @click="drawCard">
      <div v-if="stock.drawPile.cards.length === 0" class="card empty">×</div>
      <template v-else>
        <div v-for="card in stock.drawPile.cards.slice(-3)" :key="card.id" class="card-container">
          <Card :can-be-clicked="false" :card="card" :can-be-dragged="false" />
        </div>
      </template>
    </div>

    <div class="discard-pile">
      <template v-if="stock.discardPile.cards.length > 0">
        <div
          v-for="card in stock.discardPile.cards.slice(-3)"
          :key="card.id"
          class="card-container"
        >
          <!-- TODO: handle can be clicked -->
          <Card
            :card="card"
            :can-be-clicked="stock.discardPile.cards.at(-1) === card"
            :being-dragged="dragging?.cards.includes(card) ?? false"
            :can-be-dragged="stock.discardPile.cards.at(-1) === card"
            @drag-start="(e) => startCardDrag(card, stock.discardPile, e)"
          />
        </div>
      </template>
      <div v-else class="card empty">×</div>
    </div>
  </div>
</template>

<style scoped>
.stock {
  display: flex;
  gap: 1rem;
}

.draw-pile {
  width: var(--card-width);
  height: var(--card-height);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.draw-pile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.discard-pile {
  width: var(--card-width);
  height: var(--card-height);
  position: relative;
  border-radius: 8px;
}

.card-container {
  position: relative;
}

.card-container:not(:first-child) {
  margin-top: -70px;
}

.card:hover {
  cursor: pointer !important;
}
</style>
