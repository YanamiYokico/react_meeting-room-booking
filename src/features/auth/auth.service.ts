import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth } from '../../firebase/firebase'
import { db } from '../../firebase/firebase'

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  if (!cred.user) {
    throw new Error('User not created')
  }

  await updateProfile(cred.user, { displayName: name })

  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email: cred.user.email,
    name,
  })

  return cred.user
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logoutUser() {
  await signOut(auth)
}
