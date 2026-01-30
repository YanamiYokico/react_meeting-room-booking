import {
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  serverTimestamp,
  where,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export type Room = {
  id: string
  name: string
  description: string
  createdBy: string
  members: Record<string, 'admin' | 'user'>
}

const roomsRef = collection(db, 'rooms')

export async function createRoom(
  userId: string,
  name: string,
  description: string
) {
  await addDoc(roomsRef, {
    name,
    description,
    createdBy: userId,
    members: {
      [userId]: 'admin',
    },
    createdAt: serverTimestamp(),
  })
}

export async function getUserRooms(userId: string): Promise<Room[]> {
  const q = query(
    roomsRef,
    where(`members.${userId}`, 'in', ['admin', 'user'])
  )
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Room, 'id'>),
  }))
}

export async function updateRoom(
  roomId: string, data: {name: string, description: string}
) {
  const ref = doc(db, 'rooms', roomId);

  await updateDoc(ref, data);
}

export async function deleteRoom(roomId: string) {
  const ref = doc(db, 'rooms', roomId)

  await deleteDoc(ref)
}