import type { Card } from './Card'

export interface Pile {
  cards: Card[]

  addCard(card: Card): void

  removeCard(cardId: string): Card | undefined

  isEmpty(): boolean
}
