import { Card } from '@/models/Card'
import type { Suit } from '@/models/Card'

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push(new Card(value, suit, false))
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
