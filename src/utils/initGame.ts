import type { Card } from '@/models/Card'
import type { Pile } from '@/models/Pile'
import { createDeck } from './deck'

export interface GameState {
  tableau: Pile[] // 7 columns
  foundations: Pile[] // 4 empty foundations
  stock: {
    drawPile: Card[]
    discardPile: Card[]
  }
}

export function initGame(): GameState {
  const deck = createDeck() // shuffled deck of cards
  const tableau: Pile[] = []
  let deckIndex = 0

  // distribute cards to tableau
  // 7 columns, each with an increasing number of cards
  for (let col = 0; col < 7; col++) {
    const cards: Card[] = []

    for (let i = 0; i <= col; i++) {
      const card = deck[deckIndex++]
      cards.push({
        ...card,
        faceUp: i === col, // only the last card is face up
      })
    }

    tableau.push({ cards })
  }

  // remaining cards in the deck are the draw pile
  const drawPile: Card[] = deck.slice(deckIndex)
  const discardPile: Card[] = []

  const foundations: Pile[] = [{ cards: [] }, { cards: [] }, { cards: [] }, { cards: [] }]

  return {
    tableau,
    foundations,
    stock: {
      drawPile,
      discardPile,
    },
  }
}
