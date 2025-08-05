import type { Card } from './Card'
import { Pile } from './Pile'

export class Foundation extends Pile {
  isValidMove(card: Card): boolean {
    // A card can be placed on a foundation if it is one rank higher than the top card
    if (this.isEmpty()) {
      return card.value === 1 // Only an Ace can start a foundation
    }

    const { topCard } = this
    return card.value === topCard!.value + 1 && card.suit === topCard!.suit
  }
}
