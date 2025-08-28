<script setup lang="ts">
import Card from './card/CardComponent.vue'
import { inject } from 'vue'
import type { TUseDrag } from '@/services/composables/useCardDrag'
import { useDragKey } from '@/constants/provideKeys'
import type { DrawPile } from '@/models/DrawPile'
import type { DiscardPile } from '@/models/DiscardPile'

const useDrag = inject<TUseDrag>(useDragKey)
if (!useDrag) {
  throw new Error(
    'useDrag is not provided. Ensure you are using this component within a provider context.',
  )
}

const stock = defineModel<{ drawPile: DrawPile; discardPile: DiscardPile }>({ required: true })

const { dragStart, dragEnd } = useDrag

const drawCard = () => {
  if (stock.value.drawPile.cards.length === 0) handleLastCardDrawn()

  const card = stock.value.drawPile.cards.shift()
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
      <Card
        :can-be-clicked="false"
        :card="stock.drawPile.cards[0]"
        v-if="stock.drawPile.cards.length > 0"
      />
      <div v-else class="card empty">×</div>
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
            @drag-start="dragStart(card, stock.discardPile)"
            @drag-end="dragEnd"
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
}

.discard-pile {
  width: var(--card-width);
  height: var(--card-height);
  position: relative;
}

.card-container {
  position: relative;
}

.card-container:not(:first-child) {
  margin-top: -70px;
}
</style>
