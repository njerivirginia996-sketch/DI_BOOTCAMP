import { useCallback, useEffect, useRef, useState } from 'react'

type CacheEntry<T> = { data: T; timestamp: number }
type DataFetchConfig = { maxAge: number }

const requestCache = new Map<string, CacheEntry<unknown>>()

export function useDataFetching<T>(url: string, { maxAge }: DataFetchConfig) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const requestId = useRef(0)
  const activeController = useRef<AbortController | null>(null)

  const load = useCallback(async (skipCache: boolean) => {
    const currentRequest = ++requestId.current
    activeController.current?.abort()

    const cached = requestCache.get(url) as CacheEntry<T> | undefined
    if (!skipCache && cached && Date.now() - cached.timestamp < maxAge) {
      setData(cached.data)
      setUpdatedAt(cached.timestamp)
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    activeController.current = controller
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)
      const result = (await response.json()) as T
      if (requestId.current !== currentRequest) return
      const timestamp = Date.now()
      requestCache.set(url, { data: result, timestamp })
      setData(result)
      setUpdatedAt(timestamp)
    } catch (fetchError) {
      if (controller.signal.aborted || requestId.current !== currentRequest) return
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to fetch data.')
    } finally {
      if (requestId.current === currentRequest) setLoading(false)
    }
  }, [maxAge, url])

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(false), 0)
    return () => {
      window.clearTimeout(initialLoad)
      requestId.current += 1
      activeController.current?.abort()
    }
  }, [load])

  const refetch = useCallback(() => load(true), [load])
  const invalidateCache = useCallback(() => {
    requestCache.delete(url)
    return load(true)
  }, [load, url])

  return { data, error, loading, updatedAt, refetch, invalidateCache }
}
