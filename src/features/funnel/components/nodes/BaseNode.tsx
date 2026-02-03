import { useEffect, useRef, useState } from 'react'
import { Handle, Position } from 'reactflow'

import { useFunnelStore } from '../../state/store'
import type { FunnelNodeData } from '../../types'
import trashIcon from '../../../../assets/trash.png'

type BaseNodeProps = {
  id: string
  data: FunnelNodeData
  accentColor: string
  showSource?: boolean
  selected?: boolean
}

export function BaseNode({
  id,
  data,
  accentColor,
  showSource = true,
  selected = false,
}: BaseNodeProps) {
  const removeNode = useFunnelStore((state) => state.removeNode)
  const updateNodeTitle = useFunnelStore((state) => state.updateNodeTitle)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.title)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Reset edit value when data changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(data.title)
    }
  }, [data.title, isEditing])

  const handleStartEdit = () => {
    setEditValue(data.title)
    setIsEditing(true)
  }

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== data.title) {
      updateNodeTitle(id, trimmed)
    } else {
      setEditValue(data.title) // Reset if empty or unchanged
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(data.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <div className="funnel-node" style={{ borderColor: accentColor }}>
      <Handle type="target" position={Position.Left} className="funnel-node__handle" />
      {showSource && (
        <Handle type="source" position={Position.Right} className="funnel-node__handle" />
      )}
      {selected && !isEditing && (
        <div className="node-actions">
          <button
            type="button"
            className="node-action-button node-action-button--edit"
            aria-label="Edit node title"
            title="Edit"
            onClick={handleStartEdit}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            type="button"
            className="node-action-button node-action-button--delete"
            aria-label="Delete node"
            title="Delete"
            onClick={() => removeNode(id)}
          >
            <img src={trashIcon} className="delete-icon-image" alt="" aria-hidden />
          </button>
        </div>
      )}
      <div className="funnel-node__header">
        <div className="funnel-node__icon" style={{ backgroundColor: accentColor }} aria-hidden />
        <div className="funnel-node__info">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="funnel-node__input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              aria-label="Node title"
            />
          ) : (
            <p className="funnel-node__label">{data.title}</p>
          )}
          <p className="funnel-node__type">{data.type.replace('thankyou', 'thank you')}</p>
        </div>
      </div>
      <div className="funnel-node__footer">
        <span className="funnel-node__button">{data.buttonLabel}</span>
      </div>
    </div>
  )
}
