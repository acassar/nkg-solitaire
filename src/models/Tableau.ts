import type { Card } from './Card'

export class Tableau {
  cards: Card[]

  constructor(cards: Card[] = []) {
    this.cards = cards
  }

  addCard(card: Card) {
    this.cards.push(card)
  }

  removeCard(cardId: string): Card | undefined {
    const index = this.cards.findIndex((card) => card.id === cardId)
    if (index !== -1) {
      return this.cards.splice(index, 1)[0]
    }
    return undefined
  }

  isEmpty(): boolean {
    return this.cards.length === 0
  }
}
