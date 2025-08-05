import type { Card } from '@/models/Card'
import type { Pile } from '@/models/Pile'
import { createDeck } from './deck'
import { Tableau } from '@/models/Tableau'

export interface GameState {
  tableau: Tableau[] // 7 columns
  foundations: Pile[] // 4 empty foundations
  stock: {
    drawPile: Card[]
    discardPile: Card[]
  }
  deck: Card[] // shuffled deck of cards
}

export function initGame(): GameState {
  const deck = createDeck() // shuffled deck of cards
  const tableau: Tableau[] = []
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

    tableau.push(new Tableau(cards))
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
    deck,
  }
}
