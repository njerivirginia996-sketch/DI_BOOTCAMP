import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  company: {
    name: string
  }
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Could not load users (${response.status}).`)
        }

        const data: User[] = await response.json()
        setUsers(data)
      } catch (caughtError) {
        if (controller.signal.aborted) return
        setError(caughtError instanceof Error ? caughtError.message : 'An unexpected error occurred.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadUsers()
    return () => controller.abort()
  }, [])

  if (loading) {
    return <p className="request-state" role="status">Loading users...</p>
  }

  if (error) {
    return <p className="request-state error-state" role="alert">{error}</p>
  }

  return (
    <section aria-label="Users">
      <p className="user-count">{users.length} users</p>
      <ul className="user-list">
        {users.map((user) => (
          <li className="user-row" key={user.id}>
            <div className="user-avatar" aria-hidden="true">
              {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="user-details">
              <h2>{user.name}</h2>
              <p>@{user.username} | {user.company.name}</p>
              <a href={`mailto:${user.email}`}>{user.email}</a>
              <p>{user.phone}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}