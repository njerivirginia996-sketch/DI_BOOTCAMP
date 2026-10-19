import type { Key, ReactNode } from 'react'

type ListProps<T> = {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T) => Key
  emptyMessage?: string
}

export function List<T>({ items, renderItem, keyExtractor, emptyMessage = 'Nothing here yet.' }: ListProps<T>) {
  if (items.length === 0) {
    return <p className="empty-list">{emptyMessage}</p>
  }

  return (
    <ul className="book-list">
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}
