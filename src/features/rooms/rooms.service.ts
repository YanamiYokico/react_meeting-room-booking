import {
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  serverTimestamp,
  where,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import type { Room } from './rooms.types'

const roomsRef = collection(db, 'rooms')
const bookingsRef = collection(db, 'bookings')

export async function createRoom(
  userId: string,
  name: string,
  description: string
): Promise<Room> {
  const docRef = await addDoc(roomsRef, {
    name,
    description,
    createdBy: userId,
    members: {
      [userId]: 'admin',
    },
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    name,
    description,
    createdBy: userId,
    members: {
      [userId]: 'admin',
    },
  }
}

export async function getUserRooms(userId: string): Promise<Room[]> {
  const q = query(
    roomsRef,
    where(`members.${userId}`, 'in', ['admin', 'user'])
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Room, 'id'>),
  }))
}

export async function updateRoom(
  roomId: string,
  data: { name: string; description: string }
) {
  const ref = doc(db, 'rooms', roomId)
  await updateDoc(ref, data)
}

export async function deleteRoom(roomId: string) {
  const batch = writeBatch(db)

  const q = query(bookingsRef, where('roomId', '==', roomId))
  const bookingsSnap = await getDocs(q)

  bookingsSnap.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref)
  })

  const roomRef = doc(db, 'rooms', roomId)
  batch.delete(roomRef)

  await batch.commit()
}

export async function addMemberToRoom(
  room: Room,
  currentUserId: string,
  email: string,
  role: 'admin' | 'user'
) {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email)
  )

  const snap = await getDocs(q)

  if (snap.empty) {
    throw new Error('User with this email not found')
  }

  const userIdToAdd = snap.docs[0].id

  if (userIdToAdd === currentUserId) {
    throw new Error('You cannot add yourself to the room')
  }

  if (room.members[userIdToAdd]) {
    throw new Error('User is already a member of this room')
  }

  const roomRef = doc(db, 'rooms', room.id)

  await updateDoc(roomRef, {
    [`members.${userIdToAdd}`]: role,
  })
}
