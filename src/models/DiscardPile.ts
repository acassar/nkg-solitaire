import { Pile } from './Pile'

export class DiscardPile extends Pile {
  isValidMove(): boolean {
    return false
  }
}
