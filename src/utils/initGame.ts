import type { Card } from '@/models/Card'
import { createDeck } from './deck'
import { Tableau } from '@/models/Tableau'
import { Foundation } from '@/models/Foundation'

type SevenTableau = [Tableau, Tableau, Tableau, Tableau, Tableau, Tableau, Tableau]
type FourFoundation = [Foundation, Foundation, Foundation, Foundation]

export interface GameState {
  tableau: SevenTableau // 7 columns
  foundations: FourFoundation // 4 empty foundations
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
        { id: '1', value: 13, suit: 'hearts', faceUp: false },
        { id: '2', value: 11, suit: 'spades', faceUp: true },
      ]),
      new Tableau([
        { id: '3', value: 11, suit: 'clubs', faceUp: false },
        { id: '4', value: 10, suit: 'diamonds', faceUp: true },
      ]),
      new Tableau([
        { id: '5', value: 9, suit: 'hearts', faceUp: false },
        { id: '6', value: 12, suit: 'diamonds', faceUp: true },
      ]),
      new Tableau([{ id: '7', value: 13, suit: 'spades', faceUp: true }]),
      new Tableau([
        { id: '10', value: 3, suit: 'hearts', faceUp: false },
        { id: '9', value: 2, suit: 'hearts', faceUp: false },
        { id: '8', value: 1, suit: 'hearts', faceUp: true },
      ]),
      new Tableau([]),
      new Tableau([]),
    ] as SevenTableau,
    foundations: [
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
    ] as FourFoundation,
    stock: {
      drawPile: [],
      discardPile: [],
    },
    deck: createDeck(),
  }
}
