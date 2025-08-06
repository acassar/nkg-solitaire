import type { Card } from '@/models/Card'
import type { Foundation } from '@/models/Foundation'
import type { Tableau } from '@/models/Tableau'

const moveCardFromTableauToFoundation = (
  sourceTableau: Tableau,
  targetFoundation: Foundation,
  card: Card,
): void => {
  sourceTableau.removeCard(card.id)
  targetFoundation.addCard(card)

  sourceTableau.revealTopCard()
}

export const moveStackedCardsFromTableauToFoundation = (
  sourceTableau: Tableau,
  targetFoundation: Foundation,
  stackedCards: Card[],
): void => {
  stackedCards.forEach((card) => {
    moveCardFromTableauToFoundation(sourceTableau, targetFoundation, card)
  })
}
