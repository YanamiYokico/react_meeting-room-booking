import { useState } from 'react'
import { updateRoom, type Room } from './rooms.service'

type Props = {
  room: Room
  onUpdated: (room: Room) => void
}

export function RoomEditForm({ room, onUpdated }: Props) {
  const [name, setName] = useState(room.name)
  const [description, setDescription] = useState(room.description)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!editing) {
    return (
      <button
        className="text-sm text-blue-600"
        onClick={() => setEditing(true)}
      >
        Edit room
      </button>
    )
  }

  return (
    <div className="space-y-2 border p-3 rounded bg-gray-50">
      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 disabled:opacity-50"
          onClick={async () => {
            try {
              setLoading(true)

              await updateRoom(room.id, { name, description })

              onUpdated({
                ...room,
                name,
                description,
              })

              setEditing(false)
            } finally {
              setLoading(false)
            }
          }}
        >
          Save
        </button>

        <button
          className="text-gray-500"
          onClick={() => {
            setName(room.name)
            setDescription(room.description)
            setEditing(false)
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
