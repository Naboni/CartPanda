import { useState } from 'react'

import type { FunnelState } from '../types'
import { funnelStateSchema } from '../schema/funnelSchema'

type ImportExportArgs = {
  nodes: FunnelState['nodes']
  edges: FunnelState['edges']
  setState: (importedState: Pick<FunnelState, 'nodes' | 'edges'>) => void
}

export function useFunnelImportExport({ nodes, edges, setState }: ImportExportArgs) {
  const [importError, setImportError] = useState<string | null>(null)

  const handleExport = () => {
    const payload: Pick<FunnelState, 'nodes' | 'edges'> = {
      nodes,
      edges,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cartpanda-funnel.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const content = typeof reader.result === 'string' ? reader.result : ''
        const parsed = JSON.parse(content)
        const result = funnelStateSchema.safeParse(parsed)
        if (!result.success) {
          setImportError('Invalid funnel JSON. Please check the file and try again.')
          return
        }
        setState(result.data)
        setImportError(null)
      } catch {
        setImportError('Unable to read JSON file. Please verify the file and try again.')
      }
    }
    reader.onerror = () => {
      setImportError('Unable to read the selected file.')
    }
    reader.readAsText(file)
  }

  return { handleExport, handleImport, importError }
}
