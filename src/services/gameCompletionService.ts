import type { GameState } from '@/utils/initGame'

export const isGameCompleted = (gameState: GameState): boolean => {
  // Check if all foundations have 13 cards (Ace to King)
  return gameState.foundations.every(foundation => foundation.cards.length === 13)
}

export const getCompletionStats = (gameState: GameState) => {
  const foundationStats = gameState.foundations.map(foundation => ({
    suit: foundation.cards.length > 0 ? foundation.cards[0].suit : null,
    cardsCount: foundation.cards.length,
    isComplete: foundation.cards.length === 13
  }))

  const totalFoundationCards = foundationStats.reduce((sum, stat) => sum + stat.cardsCount, 0)
  const completedFoundations = foundationStats.filter(stat => stat.isComplete).length

  return {
    foundationStats,
    totalFoundationCards,
    completedFoundations,
    isGameCompleted: isGameCompleted(gameState)
  }
}

