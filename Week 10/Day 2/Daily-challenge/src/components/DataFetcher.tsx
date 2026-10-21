import { useEffect, useState, type Key, type ReactNode } from 'react'
import { clearData, requestFailed, requestStarted, requestSucceeded } from '../features/dataSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'

type DataFetcherProps<T> = {
  query: string
  fetchData: (query: string, signal: AbortSignal) => Promise<T[]>
  getKey: (item: T) => Key
  renderItem: (item: T, index: number) => ReactNode
  emptyMessage: string
}

export function DataFetcher<T>({ query, fetchData, getKey, renderItem, emptyMessage }: DataFetcherProps<T>) {
  const dispatch = useAppDispatch()
  const { data: storedData, status, error } = useAppSelector((state) => state.data)
  const [retryCount, setRetryCount] = useState(0)
  const data = Array.isArray(storedData) ? storedData as T[] : []

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      dispatch(clearData())
      return
    }

    const controller = new AbortController()
    const requestId = crypto.randomUUID()
    const debounceTimer = window.setTimeout(() => {
      dispatch(requestStarted(requestId))
      void fetchData(normalizedQuery, controller.signal)
        .then((result) => dispatch(requestSucceeded({ requestId, data: result })))
        .catch((reason: unknown) => {
          if (controller.signal.aborted) return
          const message = reason instanceof Error ? reason.message : 'Something went wrong while loading recipes.'
          dispatch(requestFailed({ requestId, error: message }))
        })
    }, 280)

    return () => {
      window.clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [dispatch, fetchData, query, retryCount])

  if (status === 'idle') return <p className="search-prompt">Search a dish, ingredient, or cuisine to fill the table.</p>

  return (
    <section aria-live="polite" className="results-area" aria-busy={status === 'loading'}>
      {status === 'loading' && data.length === 0 && <div className="loading-state" role="status"><span className="loader-mark" aria-hidden="true">✳</span><p>Looking through the recipe box…</p></div>}
      {status === 'loading' && data.length > 0 && <p className="refreshing-note" role="status"><span className="tiny-spinner" /> Updating results…</p>}
      {status === 'failed' && <div className="error-state" role="alert"><span className="error-mark" aria-hidden="true">!</span><div><strong>We couldn’t load those recipes.</strong><p>{error}</p><button className="retry-button" onClick={() => setRetryCount((count) => count + 1)} type="button">Try again <span aria-hidden="true">↻</span></button></div></div>}
      {status === 'succeeded' && data.length === 0 && <div className="empty-state"><span aria-hidden="true">⌕</span><h2>No recipes found</h2><p>{emptyMessage}</p></div>}
      {data.length > 0 && <div className="recipe-grid">{data.map((item, index) => <div key={getKey(item)}>{renderItem(item, index)}</div>)}</div>}
    </section>
  )
}