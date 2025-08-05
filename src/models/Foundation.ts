import type { Card } from './Card'
import type { Pile } from './Pile'

export interface Foundation extends Pile {
  cards: Card[]
}
