import type { FirebaseError } from 'firebase/app'

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    const code = (error as FirebaseError).code

    switch (code) {
      case 'auth/email-already-in-use':
        return 'A user with this email already exists'

      case 'auth/invalid-email':
        return 'Invalid email format'

      case 'auth/weak-password':
        return 'Password must be at least 6 characters long'

      case 'auth/user-not-found':
        return 'User with this email does not exist'

      case 'auth/wrong-password':
        return 'Incorrect password'

      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return 'Invalid email or password'

      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later'

      default:
        return 'Something went wrong. Please try again'
    }
  }

  return 'Unknown error'
}
