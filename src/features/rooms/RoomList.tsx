import { useEffect, useState } from 'react'
import { deleteRoom } from './rooms.service'
import { useAuthStore } from '../auth/auth.store'
import { BookingList } from '../bookings/BookingList'
import { RoomEditForm } from './RoomEditForm'
import { RoomForm } from './RoomForm'
import { AddRoomMemberForm } from './AddRoomMemberForm'
import type { Room } from './rooms.types'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export function RoomList() {
  const user = useAuthStore((s) => s.user)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'rooms'),
      where(`members.${user.uid}`, 'in', ['admin', 'user'])
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Room, 'id'>),
      }))

      setRooms(rooms)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])


  if (!user) return null
  if (loading) return <div>Loading rooms...</div>

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your rooms</h3>

      <RoomForm
        onCreated={(room) => {
          setRooms((prev) => [room, ...prev])
        }}
      />

      {rooms.length === 0 && (
        <div className="text-gray-500">No rooms yet</div>
      )}

      {rooms.map((room) => {
        const role = room.members[user.uid]

        return (
          <div
            key={room.id}
            className="border p-4 rounded space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{room.name}</div>
                <div className="text-sm text-gray-600">
                  {room.description}
                </div>
                <div className="text-xs mt-1">
                  Your role: <b>{role}</b>
                </div>
              </div>

              {role === 'admin' && (
                <div className="flex gap-2">
                  <RoomEditForm
                    room={room}
                    onUpdated={(updatedRoom) => {
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === updatedRoom.id ? updatedRoom : r
                        )
                      )
                    }}
                  />

                  <button
                    className="text-sm text-red-600"
                    onClick={async () => {
                      const ok = confirm(
                        'Delete this room? All bookings will be lost.'
                      )
                      if (!ok) return

                      await deleteRoom(room.id)
                      setRooms((prev) =>
                        prev.filter((r) => r.id !== room.id)
                      )
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {role === 'admin' && (
              <AddRoomMemberForm room={room} />
            )}

            <BookingList
              roomId={room.id}
              roomRole={room.members[user.uid]}
            />
          </div>
        )
      })}
    </div>
  )
}
