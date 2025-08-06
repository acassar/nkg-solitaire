import type { Card } from '@/models/Card'
import type { Tableau } from '@/models/Tableau'

export const moveCardFromTableauToTableau = (
  sourceTableau: Tableau,
  targetTableau: Tableau,
  card: Card,
): boolean => {
  if (!targetTableau.isValidMove(card)) {
    return false
  }

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
