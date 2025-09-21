import type { GameState } from '@/utils/initGame'

export interface GameStats {
  score: number
  moves: number
  timeElapsed: number
  foundationCards: number
  completedFoundations: number
}

export class Score {
  private startTime: number
  private moves: number = 0
  private score: number = 0

  constructor() {
    this.startTime = Date.now()
  }

  incrementMoves(): void {
    this.moves++
  }

  addScore(points: number): void {
    this.score += points
  }

  getStats(gameState: GameState): GameStats {
    const timeElapsed = Date.now() - this.startTime
    const foundationCards = gameState.foundations.reduce((sum, foundation) => sum + foundation.cards.length, 0)
    const completedFoundations = gameState.foundations.filter(foundation => foundation.cards.length === 13).length

    return {
      score: this.score,
      moves: this.moves,
      timeElapsed,
      foundationCards,
      completedFoundations
    }
  }

  reset(): void {
    this.startTime = Date.now()
    this.moves = 0
    this.score = 0
  }

  // Scoring rules
  static readonly SCORES = {
    FOUNDATION_CARD: 10,
    TABLEAU_TO_FOUNDATION: 10,
    WASTE_TO_FOUNDATION: 10,
    WASTE_TO_TABLEAU: 5,
    TABLEAU_TO_TABLEAU: 5,
    REVEAL_TABLEAU_CARD: 5,
    WASTE_TO_WASTE: -2, // Penalty for cycling through waste pile
  }
}

