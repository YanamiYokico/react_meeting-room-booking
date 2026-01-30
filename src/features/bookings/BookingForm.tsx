import { useState } from 'react'
import { createBooking } from './bookings.service'
import { useAuthStore } from '../auth/auth.store'

type Props = {
  roomId: string
}

export function BookingForm({ roomId }: Props) {
  const user = useAuthStore((s) => s.user)

  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
        disabled={submitting}
        className="bg-green-600 text-white px-3 py-1 disabled:opacity-50"
        onClick={async () => {
          if (submitting) return

          try {
            setSubmitting(true)
            setError(null)

            await createBooking(
              roomId,
              new Date(start),
              new Date(end),
              description,
              user.uid
            )

            setStart('')
            setEnd('')
            setDescription('')
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {submitting ? 'Booking...' : 'Book'}
      </button>
    </div>
  )
}
