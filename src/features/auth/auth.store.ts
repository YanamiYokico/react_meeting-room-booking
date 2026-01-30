import { create } from 'zustand'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { loginUser, logoutUser, registerUser } from './auth.service'
import type { AuthState } from './auth.types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    const user = await loginUser(email, password)
    set({ user })
  },

  register: async (name, email, password) => {
    const user = await registerUser(name, email, password)
    set({ user })
  },

  logout: async () => {
    await logoutUser()
    set({ user: null })
  },
}))

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false })
})
