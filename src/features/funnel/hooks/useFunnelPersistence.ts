import { useEffect, useRef, useState } from 'react'

import type { FunnelState } from '../types'
import { funnelStateSchema } from '../schema/funnelSchema'
import { STORAGE_KEY } from '../utils/storage'

type PersistenceArgs = {
  nodes: FunnelState['nodes']
  edges: FunnelState['edges']
  setState: (importedState: Pick<FunnelState, 'nodes' | 'edges'>) => void
  reset: () => void
}

export function useFunnelPersistence({ nodes, edges, setState, reset }: PersistenceArgs) {
  const [storageError, setStorageError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)
  const saveTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      hasLoadedRef.current = true
      return
    }
    try {
      const parsed = JSON.parse(stored)
      const result = funnelStateSchema.safeParse(parsed)
      if (result.success) {
        setState(result.data)
        setStorageError(null)
      } else {
        setStorageError('Saved data was invalid and has been reset.')
        reset()
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      setStorageError('Saved data could not be parsed and has been reset.')
      reset()
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      hasLoadedRef.current = true
    }
  }, [reset, setState])

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return
    }
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      const payload: Pick<FunnelState, 'nodes' | 'edges'> = {
        nodes,
        edges,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    }, 250)
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [edges, nodes])

  return { storageError }
}
