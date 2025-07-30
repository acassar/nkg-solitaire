import { v4 as uuidv4 } from 'uuid'
import type { Card, Suit } from '@/models/Card'

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push({
        id: uuidv4(), // identifiant unique
        value,
        suit,
        faceUp: false,
      })
    }
  }

  return shuffle(deck)
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
