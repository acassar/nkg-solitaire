import type { Card } from '@/models/Card'
import type { Pile } from '@/models/Pile'
import { Tableau } from '@/models/Tableau'
import { Foundation } from '@/models/Foundation'
import { DiscardPile } from '@/models/DiscardPile'
import { moveStackedCardsFromTableauToTableau } from './tableauService'
import { moveStackedCardsFromTableauToFoundation } from './foundationService'

// Type helpers

// Move strategy interface
interface MoveStrategy {
  execute: (from: Pile, target: Pile, cards: Card[]) => void
  allowMultipleCards?: boolean
}

// Generic move strategies
const createSimpleMoveStrategy = (allowMultiple = false): MoveStrategy => ({
  execute: (from, target, cards) => {
    const cardsToMove = allowMultiple ? cards : [cards[0]]
    cardsToMove.forEach((card) => {
      const removedCard = from.removeCard(card.id)
      if (removedCard) target.addCard(removedCard)
    })
  },
  allowMultipleCards: allowMultiple,
})

const createTableauMoveStrategy = (): MoveStrategy => ({
  execute: (from, target, cards) => {
    moveStackedCardsFromTableauToTableau(from as Tableau, target as Tableau, cards)
  },
  allowMultipleCards: true,
})

const createFoundationMoveStrategy = (): MoveStrategy => ({
  execute: (from, target, cards) => {
    moveStackedCardsFromTableauToFoundation(from as Tableau, target as Foundation, [cards[0]])
  },
  allowMultipleCards: false,
})

// Move registry: Map from source+target types to strategy
type MoveKey = string
const moveRegistry = new Map<MoveKey, MoveStrategy>([
  // Tableau to Tableau
  [`${Tableau.name}-${Tableau.name}`, createTableauMoveStrategy()],

  // DiscardPile to Tableau
  [`${DiscardPile.name}-${Tableau.name}`, createSimpleMoveStrategy(false)],

  // Tableau to Foundation
  [`${Tableau.name}-${Foundation.name}`, createFoundationMoveStrategy()],

  // Foundation to Tableau
  [`${Foundation.name}-${Tableau.name}`, createSimpleMoveStrategy(false)],

  // DiscardPile to Foundation
  [`${DiscardPile.name}-${Foundation.name}`, createSimpleMoveStrategy(false)],
])

/**
 * Generate move key from pile types
 */
const getMoveKey = (from: Pile, target: Pile): MoveKey => {
  return `${from.constructor.name}-${target.constructor.name}`
}

/**
 * Process a move using direct lookup
 */
export const processMoveHandlers = (from: Pile, target: Pile, cards: Card[]): boolean => {
  const moveKey = getMoveKey(from, target)
  const strategy = moveRegistry.get(moveKey)

  if (!strategy) {
    return false // No handler found for this move type
  }

  // Validate move
  if (!target.isValidMove(cards[0])) {
    console.warn(
      `Invalid move: cannot move ${cards[0].suit} ${cards[0].value} to ${target.constructor.name}`,
    )
    return true // Handled but invalid
  }

  // Validate card count
  if (!strategy.allowMultipleCards && cards.length > 1) {
    console.warn(`Cannot move multiple cards to ${target.constructor.name}`)
    return true // Handled but invalid
  }

  // Execute move
  strategy.execute(from, target, cards)

  return true
}
