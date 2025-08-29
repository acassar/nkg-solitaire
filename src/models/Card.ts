import { v4 } from 'uuid'

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export class Card {
  public id: string
  public value: number // 1 to 13 (Ace to King)
  public suit: Suit
  public faceUp: boolean

  constructor(value: number, suit: Suit, faceUp: boolean = false) {
    this.id = v4()
    this.value = value
    this.suit = suit
    this.faceUp = faceUp
  }

  // Method to flip the card
  flip(): void {
    this.faceUp = !this.faceUp
  }

  // Method to get the card value as a string (A, 2, 3, ..., K)
  getValueString(): string {
    switch (this.value) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return this.value.toString()
    }
  }

  // Method to check if the card is red
  isRed(): boolean {
    return this.suit === 'hearts' || this.suit === 'diamonds'
  }

  // Method to check if the card is black
  isBlack(): boolean {
    return this.suit === 'clubs' || this.suit === 'spades'
  }

  // Method to create a copy of the card
  clone(): Card {
    return new Card(this.value, this.suit, this.faceUp)
  }
}
