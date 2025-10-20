import type { GameState } from '@/utils/initGame'

export interface GameStats {
  score: number
  moves: number
  foundationCards: number
  completedFoundations: number
}

export class Score {
  public startTime: number
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
    const foundationCards = gameState.foundations.reduce(
      (sum, foundation) => sum + foundation.cards.length,
      0,
    )
    const completedFoundations = gameState.foundations.filter(
      (foundation) => foundation.cards.length === 13,
    ).length

    return {
      score: this.score,
      moves: this.moves,
      foundationCards,
      completedFoundations,
    }
  }

  reset(): void {
    this.startTime = Date.now()
    this.moves = 0
    this.score = 0
  }

  // Scoring rules
  static readonly SCORES = {
    TABLEAU_TO_FOUNDATION: 100,
    WASTE_CYCLE: -15,
  }
}
