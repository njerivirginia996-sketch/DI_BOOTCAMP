interface UserCardProps {
  name?: string
  age?: number
  role?: string
}

export default function UserCard({
  name = 'Guest User',
  age = 18,
  role = 'Member',
}: UserCardProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="user-card">
      <div className="user-avatar" aria-hidden="true">{initials}</div>
      <div>
        <h2>{name}</h2>
        <p className="user-role">{role}</p>
      </div>
      <p className="user-age">{age} years old</p>
    </article>
  )
}