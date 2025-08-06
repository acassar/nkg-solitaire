import type { Card } from '@/models/Card'
import type { Tableau } from '@/models/Tableau'

const moveCardFromTableauToTableau = (
  sourceTableau: Tableau,
  targetTableau: Tableau,
  card: Card,
): boolean => {
  // Remove the card from the original pile
  const removedCard = sourceTableau.removeCard(card.id)
  if (!removedCard) {
    return false
  }

  // Add the card to the target pile
  targetTableau.addCard(removedCard)

  sourceTableau.revealTopCard()
  return true
}

export const moveStackedCardsFromTableauToTableau = (
  sourceTableau: Tableau,
  targetTableau: Tableau,
  stackedCards: Card[],
): void => {
  stackedCards.forEach((card) => {
    return moveCardFromTableauToTableau(sourceTableau, targetTableau, card)
  })
}
