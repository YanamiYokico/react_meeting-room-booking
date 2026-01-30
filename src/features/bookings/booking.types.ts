import { Timestamp } from 'firebase/firestore'

export type Booking = {
  id: string
  roomId: string
  startAt: Timestamp
  endAt: Timestamp
  description: string
  createdBy: string
}
