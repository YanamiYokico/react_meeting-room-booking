import { useState } from 'react'
import type { Booking } from './booking.types'
import { updateBooking } from './bookings.service'
import { Timestamp } from 'firebase/firestore'
import { toDatetimeLocal } from '../../shared/utils/date'

type Props = {
  booking: Booking
  onUpdated: (booking: Booking) => void
}

export function BookingEditForm({ booking, onUpdated }: Props) {
  const [editing, setEditing] = useState(false)

  const [start, setStart] = useState(
    toDatetimeLocal(booking.startAt.toDate())
  )

  const [end, setEnd] = useState(
    toDatetimeLocal(booking.endAt.toDate())
  )

  const [description, setDescription] = useState(booking.description)
  const [error, setError] = useState<string | null>(null)

  if (!editing) {
    return (
      <button
        className="text-xs text-blue-600"
        onClick={() => setEditing(true)}
      >
        Edit
      </button>
    )
  }

  return (
    <div className="border p-2 rounded space-y-2 bg-gray-50">
      <input
        type="datetime-local"
        className="border p-1 w-full"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <input
        type="datetime-local"
        className="border p-1 w-full"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <input
        className="border p-1 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <div className="text-xs text-red-600">{error}</div>}

      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-2 py-1 text-xs"
          onClick={async () => {
            try {
              setError(null)

              const startDate = new Date(start)
              const endDate = new Date(end)

              await updateBooking(
                booking,
                startDate,
                endDate,
                description
              )

              onUpdated({
                ...booking,
                startAt: Timestamp.fromDate(startDate),
                endAt: Timestamp.fromDate(endDate),
                description,
              })

              setEditing(false)
            } catch (e) {
              setError(e instanceof Error ? e.message : String(e))
            }
          }}
        >
          Save
        </button>

        <button
          className="text-xs text-gray-500"
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
