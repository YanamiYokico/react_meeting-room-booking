import type { Booking } from './booking.types'
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/firebase'

const bookingsRef = collection(db, 'bookings')

async function hasConflict(
  roomId: string,
  startAt: Timestamp,
  endAt: Timestamp
) {
  const q = query(
    bookingsRef,
    where('roomId', '==', roomId),
    where('startAt', '<', endAt),
    where('endAt', '>', startAt)
  )

  const snapshot = await getDocs(q)
  return !snapshot.empty
}

export async function createBooking(
  roomId: string,
  startAt: Date,
  endAt: Date,
  description: string,
  userId: string
) {
  const startTs = Timestamp.fromDate(startAt)
  const endTs = Timestamp.fromDate(endAt)

  if (endTs <= startTs) {
    throw new Error('End time must be after start time')
  }

  const conflict = await hasConflict(roomId, startTs, endTs)
  if (conflict) {
    throw new Error('Time slot is already booked')
  }

  const docRef = await addDoc(bookingsRef, {
    roomId,
    startAt: startTs,
    endAt: endTs,
    description,
    createdBy: userId,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    roomId,
    startAt: startTs,
    endAt: endTs,
    description,
    createdBy: userId,
  }
}

export async function getRoomBookings(roomId: string): Promise<Booking[]> {
  const q = query(bookingsRef, where('roomId', '==', roomId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Booking, 'id'>),
  }))
}
