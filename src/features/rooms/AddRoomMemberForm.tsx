import { useEffect, useState } from 'react'
import { addMemberToRoom } from './rooms.service'
import type { Room } from './rooms.types'
import { useAuthStore } from '../auth/auth.store'

type Props = {
  room: Room
}

export function AddRoomMemberForm({ room }: Props) {
  const currentUser = useAuthStore((s) => s.user)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!success) return

    const timer = setTimeout(() => {
      setSuccess(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [success])

  if (!currentUser) return null

  return (
    <div className="border p-3 rounded space-y-2 bg-gray-50">
      <div className="text-sm font-medium">Add member</div>

      <input
        className="border p-2 w-full"
        placeholder="User email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setError(null)
          setSuccess(false)
        }}
      />

      <select
        className="border p-2 w-full"
        value={role}
        onChange={(e) => {
          setRole(e.target.value as 'admin' | 'user')
          setError(null)
          setSuccess(false)
        }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}

      {success && (
        <div className="text-xs text-green-600">
          Member added successfully
        </div>
      )}

      <button
        disabled={loading || !email}
        className="bg-blue-600 text-white px-3 py-1 disabled:opacity-50"
        onClick={async () => {
          try {
            setLoading(true)
            setError(null)
            setSuccess(false)

            await addMemberToRoom(
              room,
              currentUser.uid,
              email.trim(),
              role
            )

            setEmail('')
            setSuccess(true)
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
          } finally {
            setLoading(false)
          }
        }}
      >
        Add member
      </button>
    </div>
  )
}
