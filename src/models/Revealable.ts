import type { Card } from './Card'

export interface Revealable {
  revealTopCard(): Card | undefined
}
