import { useEffect, useState } from 'react'
import type { Booking } from './booking.types'
import { deleteBooking } from './bookings.service'
import { BookingEditForm } from './BookingEditForm'
import { BookingForm } from './BookingForm'
import { useAuthStore } from '../auth/auth.store'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

type Props = {
  roomId: string
  roomRole: 'admin' | 'user'
}

export function BookingList({ roomId, roomRole }: Props) {
  const user = useAuthStore((s) => s.user)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'bookings'),
      where('roomId', '==', roomId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, 'id'>),
      }))

      setBookings(bookings)
    })

    return () => unsubscribe()
  }, [roomId])


  return (
    <div className="space-y-3">
      <BookingForm
        roomId={roomId}
        onCreated={(booking) => {
          setBookings((prev) => [...prev, booking])
        }}
      />

      {bookings.length === 0 && (
        <div className="text-sm text-gray-500">No bookings</div>
      )}

      {bookings.map((booking) => {
        const canManage =
          user &&
          (user.uid === booking.createdBy ||
            roomRole === 'admin')

        return (
          <div
            key={booking.id}
            className="border p-3 rounded"
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="font-medium">
                  {booking.description}
                </div>
                <div className="text-xs text-gray-600">
                  {booking.startAt
                    .toDate()
                    .toLocaleString()}{' '}
                  —{' '}
                  {booking.endAt
                    .toDate()
                    .toLocaleString()}
                </div>
              </div>

              {canManage && (
                <div className="flex gap-2 shrink-0">
                  <BookingEditForm
                    booking={booking}
                    onUpdated={(updated) => {
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === updated.id
                            ? updated
                            : b
                        )
                      )
                    }}
                  />

                  <button
                    className="text-xs text-red-600"
                    onClick={async () => {
                      const ok = confirm(
                        'Cancel this booking?'
                      )
                      if (!ok) return

                      await deleteBooking(booking.id)
                      setBookings((prev) =>
                        prev.filter(
                          (b) => b.id !== booking.id
                        )
                      )
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
