import { useAuthStore } from '../features/auth/auth.store'
import { LoginForm } from '../features/auth/LoginForm'
import { RegisterForm } from '../features/auth/RegisterForm'
import { RoomList } from '../features/rooms/RoomList'

export default function App() {
  const { user, loading, logout } = useAuthStore()

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <LoginForm />
        <RegisterForm />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-lg">
          Welcome, {user.displayName || user.email}
        </p>

        <button
          className="bg-red-600 text-white px-4 py-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <RoomList />
    </div>
  )

}
