import type { Card } from './Card'
import { Pile } from './Pile'
import type { Revealable } from './Revealable'

export class Tableau extends Pile implements Revealable {
  isValidMove(card: Card): boolean {
    // A card can be placed on a tableau if it is one rank lower and of the opposite color
    if (this.isEmpty()) {
      return card.value === 13 // Cannot place on an empty tableau, except for the king
    }

    const { topCard } = this

    return (
      card.value === topCard!.value - 1 &&
      (card.suit === 'hearts' || card.suit === 'diamonds') !==
        (topCard!.suit === 'hearts' || topCard!.suit === 'diamonds')
    )
  }

  revealTopCard(): Card | undefined {
    if (this.isEmpty()) {
      return undefined
    }

    const { topCard } = this
    if (topCard && !topCard.faceUp) {
      topCard.faceUp = true

      return topCard
    }
  }
}
