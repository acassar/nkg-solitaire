import type { Card } from '@/models/Card'
import type { GameState } from '@/utils/initGame'

export const getCardById = (gameState: GameState, cardId: string): Card | undefined => {
  return gameState.deck.find((c) => c.id === cardId)
}

export const moveCardFromTableau = (
  gameState: GameState,
  card: Card,
  targetCardId: string | null = null,
): boolean => {
  if (!card) return false

  // Find the source pile
  let sourcePileIndex: number | null = null
  for (let i = 0; i < gameState.tableau.length; i++) {
    if (gameState.tableau[i].cards.some((c) => c.id === card.id)) {
      sourcePileIndex = i
      break
    }
  }

  if (sourcePileIndex === null) return false // Card not found in tableau
  const sourcePile = gameState.tableau[sourcePileIndex]

  // Move the card to the target pile
  const targetPile = gameState.tableau.find((pile) => {
    return pile.cards.some((c) => c.id === targetCardId)
  })

  if (!targetPile || targetPile === sourcePile) return false // No target pile found

  targetPile?.cards.push(card)

  // Remove the card from the source pile
  sourcePile.cards = sourcePile.cards.filter((c) => c.id !== card.id)

  return true
}
