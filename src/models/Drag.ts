import type { Card } from './Card'
import type { Foundation } from './Foundation'
import type { Tableau } from './Tableau'

export interface Drag {
  dragging: Card
  DraggingFrom: Tableau | Foundation
}
