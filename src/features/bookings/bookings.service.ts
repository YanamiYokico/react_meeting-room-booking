import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import type { Booking } from './booking.types'

const bookingsRef = collection(db, 'bookings')

async function hasConflict(
  roomId: string,
  startAt: Timestamp,
  endAt: Timestamp,
  excludeId?: string
) {
  const q = query(
    bookingsRef,
    where('roomId', '==', roomId),
    where('startAt', '<', endAt),
    where('endAt', '>', startAt)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.some((doc) => doc.id !== excludeId)
}

export async function createBooking(
  roomId: string,
  start: Date,
  end: Date,
  description: string,
  userId: string
): Promise<Booking> {
  const startAt = Timestamp.fromDate(start)
  const endAt = Timestamp.fromDate(end)

  if (endAt <= startAt) {
    throw new Error('End time must be after start time')
  }

  const conflict = await hasConflict(roomId, startAt, endAt)
  if (conflict) {
    throw new Error('Time slot is already booked')
  }

  const docRef = await addDoc(bookingsRef, {
    roomId,
    startAt,
    endAt,
    description,
    createdBy: userId,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    roomId,
    startAt,
    endAt,
    description,
    createdBy: userId,
  }
}

export async function updateBooking(
  booking: Booking,
  start: Date,
  end: Date,
  description: string
) {
  const startAt = Timestamp.fromDate(start)
  const endAt = Timestamp.fromDate(end)

  if (endAt <= startAt) {
    throw new Error('End time must be after start time')
  }

  const conflict = await hasConflict(
    booking.roomId,
    startAt,
    endAt,
    booking.id
  )

  if (conflict) {
    throw new Error('Time slot is already booked')
  }

  const ref = doc(db, 'bookings', booking.id)
  await updateDoc(ref, {
    startAt,
    endAt,
    description,
  })
}

export async function deleteBooking(bookingId: string) {
  await deleteDoc(doc(db, 'bookings', bookingId))
}

export async function getRoomBookings(roomId: string): Promise<Booking[]> {
  const q = query(bookingsRef, where('roomId', '==', roomId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Booking, 'id'>),
  }))
}
