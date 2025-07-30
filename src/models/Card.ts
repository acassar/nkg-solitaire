export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export interface Card {
  id: string
  value: number // 1 à 13 (As à Roi)
  suit: Suit
  faceUp: boolean
}
