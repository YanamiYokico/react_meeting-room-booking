import type { User } from "firebase/auth"

export type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export type AppUser = {
  uid: string
  email: string
  name?: string
}
