import { Pile } from './Pile'

export class DrawPile extends Pile {
  isValidMove(): boolean {
    return false
  }
}
