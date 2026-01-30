import { useState } from 'react'
import { createBooking } from './bookings.service'
import { useAuthStore } from '../auth/auth.store'
import type { Booking } from './booking.types'

type Props = {
  roomId: string
  onCreated: (booking: Booking) => void
}

export function BookingForm({ roomId, onCreated }: Props) {
  const user = useAuthStore((s) => s.user)

  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!user) return null

  return (
    <div className="border p-3 rounded space-y-2">
      <h4 className="font-semibold">Create booking</h4>

      <input
        type="datetime-local"
        className="border p-2 w-full"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <input
        type="datetime-local"
        className="border p-2 w-full"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        disabled={loading}
        className="bg-green-600 text-white px-3 py-1 disabled:opacity-50"
        onClick={async () => {
          try {
            setLoading(true)
            setError(null)

            const booking = await createBooking(
              roomId,
              new Date(start),
              new Date(end),
              description,
              user.uid
            )

            onCreated(booking)

            setStart('')
            setEnd('')
            setDescription('')
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
          } finally {
            setLoading(false)
          }
        }}
      >
        Book
      </button>
    </div>
  )
}
