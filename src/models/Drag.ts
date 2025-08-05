import type { Card } from './Card'
import type { Pile } from './Pile'

export interface Dragging {
  card: Card
  from: Pile
}
