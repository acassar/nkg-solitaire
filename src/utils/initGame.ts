import { Card } from '@/models/Card'
import { createDeck } from './deck'
import { Tableau } from '@/models/Tableau'
import { Foundation } from '@/models/Foundation'
import { DrawPile } from '@/models/DrawPile'
import { DiscardPile } from '@/models/DiscardPile'

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
      cards.push(new Card(card.value, card.suit, i === col))
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
      new Tableau([new Card(13, 'hearts', false), new Card(11, 'spades', true)]),
      new Tableau([new Card(11, 'clubs', false), new Card(10, 'diamonds', true)]),
      new Tableau([new Card(9, 'hearts', false), new Card(12, 'diamonds', true)]),
      new Tableau([new Card(13, 'spades', true)]),
      new Tableau([
        new Card(3, 'hearts', false),
        new Card(2, 'hearts', false),
        new Card(1, 'hearts', true),
      ]),
      new Tableau([new Card(3, 'spades', true)]),
      new Tableau([]),
    ] as SevenTableau,
    foundations: [
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
      new Foundation([]),
    ] as FourFoundation,
    stock: {
      drawPile: new DrawPile([new Card(13, 'clubs', false), new Card(12, 'clubs', false)]),
      discardPile: new DiscardPile(),
    },
    deck: createDeck(),
  }
}
