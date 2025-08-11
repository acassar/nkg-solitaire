import type { Card } from '@/models/Card'
import { createDeck } from './deck'
import { Tableau } from '@/models/Tableau'
import { Foundation } from '@/models/Foundation'
import { DrawPile } from '@/models/DrawPile'
import { DiscardPile } from '@/models/DiscardPile'
import { v4 } from 'uuid'

type SevenTableau = [Tableau, Tableau, Tableau, Tableau, Tableau, Tableau, Tableau]
type FourFoundation = [Foundation, Foundation, Foundation, Foundation]

export interface GameState {
  tableau: SevenTableau // 7 columns
  foundations: FourFoundation // 4 empty foundations
  stock: {
    drawPile: DrawPile
    discardPile: DiscardPile
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
  const drawPile: DrawPile = new DrawPile(deck.slice(deckIndex))
  const discardPile: DiscardPile = new DiscardPile()

  const buildFoundation = () => new Foundation([]) // create empty foundations

  const foundations: Foundation[] = [
    buildFoundation(),
    buildFoundation(),
    buildFoundation(),
    buildFoundation(),
  ]

  return {
    tableau: tableau as SevenTableau,
    foundations: foundations as FourFoundation,
    stock: {
      drawPile,
      discardPile,
    },
    deck,
  }
}

export const initDevGame = (): GameState => {
  return {
    tableau: [
      new Tableau([
        { id: v4(), value: 13, suit: 'hearts', faceUp: false },
        { id: v4(), value: 11, suit: 'spades', faceUp: true },
      ]),
      new Tableau([
        { id: v4(), value: 11, suit: 'clubs', faceUp: false },
        { id: v4(), value: 10, suit: 'diamonds', faceUp: true },
      ]),
      new Tableau([
        { id: v4(), value: 9, suit: 'hearts', faceUp: false },
        { id: v4(), value: 12, suit: 'diamonds', faceUp: true },
      ]),
      new Tableau([{ id: v4(), value: 13, suit: 'spades', faceUp: true }]),
      new Tableau([
        { id: v4(), value: 3, suit: 'hearts', faceUp: false },
        { id: v4(), value: 2, suit: 'hearts', faceUp: false },
        { id: v4(), value: 1, suit: 'hearts', faceUp: true },
      ]),
      new Tableau([{ id: v4(), faceUp: true, suit: 'spades', value: 3 }]),
      new Tableau([]),
    ] as SevenTableau,
    foundations: [
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
    ] as FourFoundation,
    stock: {
      drawPile: new DrawPile([
        { faceUp: false, id: v4(), suit: 'clubs', value: 13 },
        { faceUp: false, id: v4(), suit: 'clubs', value: 12 },
      ]),
      discardPile: new DiscardPile(),
    },
    deck: createDeck(),
  }
}
