import { useEffect, useState } from 'react'
import { getRoomBookings } from './bookings.service'
import type { Booking } from './booking.types'
import { BookingForm } from './BookingForm'

type Props = {
  roomId: string
}

export function BookingList({ roomId }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    getRoomBookings(roomId).then(setBookings)
  }, [roomId])

  return (
    <>
      <BookingForm
        roomId={roomId}
        onCreated={(booking) => {
          setBookings((prev) => [...prev, booking])
        }}
      />

      {bookings.length === 0 && (
        <div className="text-sm text-gray-500">No bookings</div>
      )}

      <div className="space-y-1">
        {bookings.map((b) => (
          <div key={b.id} className="text-sm border p-2 rounded">
            <div>{b.description}</div>
            <div className="text-xs text-gray-600">
              {b.startAt.toDate().toLocaleString()} —{' '}
              {b.endAt.toDate().toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

