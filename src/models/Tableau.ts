import type { Card } from './Card'
import { Pile } from './Pile'

export class Tableau extends Pile {
  isValidMove(card: Card): boolean {
    // A card can be placed on a tableau if it is one rank lower and of the opposite color
    if (this.isEmpty()) {
      return false // Cannot place on an empty tableau, except for the king (future implementation)
    }

    const { topCard } = this

    return (
      card.value === topCard!.value - 1 &&
      (card.suit === 'hearts' || card.suit === 'diamonds') !==
        (topCard!.suit === 'hearts' || topCard!.suit === 'diamonds')
    )
  }
}
