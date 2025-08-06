import type { Card } from './Card'
import type { Pile } from './Pile'

export interface Dragging {
  cards: Card[]
  from: Pile
}
