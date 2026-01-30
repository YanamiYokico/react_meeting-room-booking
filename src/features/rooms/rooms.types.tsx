export type Room = {
  id: string
  name: string
  description: string
  createdBy: string
  members: Record<string, 'admin' | 'user'>
}