import { useState } from 'react'
import { createRoom } from './rooms.service'
import { useAuthStore } from '../auth/auth.store'

export function RoomForm() {
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!user) return null

  return (
    <div className="border p-4 rounded space-y-3 max-w-md">
      <h3 className="font-semibold">Create room</h3>

      <input
        className="w-full border p-2"
        placeholder="Room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2"
        onClick={() => {
          createRoom(user.uid, name, description)
          setName('')
          setDescription('')
        }}
      >
        Create
      </button>
    </div>
  )
}
