import { useState } from 'react'
import { useAuthStore } from './auth.store'
import { getAuthErrorMessage } from './auth.errors'

export function LoginForm() {
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>

      <input
        className="w-full border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setError(null)
        }}
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          setError(null)
        }}
      />

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 disabled:opacity-50"
        onClick={async () => {
          try {
            setLoading(true)
            setError(null)
            await login(email, password)
          } catch (e) {
            setError(getAuthErrorMessage(e))
          } finally {
            setLoading(false)
          }
        }}
      >
        Login
      </button>
    </div>
  )
}
