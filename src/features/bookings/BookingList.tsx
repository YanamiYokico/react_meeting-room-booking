import { useEffect, useState } from 'react'
import type { Booking } from './booking.types'
import { getRoomBookings, deleteBooking } from './bookings.service'
import { BookingEditForm } from './BookingEditForm'
import { useAuthStore } from '../auth/auth.store'

type Props = {
  roomId: string
}

export function BookingList({ roomId }: Props) {
  const user = useAuthStore((s) => s.user)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRoomBookings(roomId)
      .then(setBookings)
      .finally(() => setLoading(false))
  }, [roomId])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading bookings…</div>
  }

  if (bookings.length === 0) {
    return <div className="text-sm text-gray-500">No bookings</div>
  }

  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border p-3 rounded flex justify-between items-start gap-4"
        >
          {/* LEFT */}
          <div>
            <div className="font-medium">
              {booking.description}
            </div>

            <div className="text-xs text-gray-600">
              {booking.startAt.toDate().toLocaleString()} —{' '}
              {booking.endAt.toDate().toLocaleString()}
            </div>
          </div>

          {/* RIGHT */}
          {user?.uid === booking.createdBy && (
            <div className="flex gap-2 shrink-0">
              <BookingEditForm
                booking={booking}
                onUpdated={(updated) => {
                  setBookings((prev) =>
                    prev.map((b) =>
                      b.id === updated.id ? updated : b
                    )
                  )
                }}
              />

              <button
                className="text-xs text-red-600"
                onClick={async () => {
                  const ok = confirm('Cancel this booking?')
                  if (!ok) return

                  await deleteBooking(booking.id)

                  setBookings((prev) =>
                    prev.filter((b) => b.id !== booking.id)
                  )
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
