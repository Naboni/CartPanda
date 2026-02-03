import { useState } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from 'reactflow'

import { useFunnelStore } from '../../state/store'
import trashIcon from '../../../../assets/trash.png'

export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
  style,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const removeEdge = useFunnelStore((state) => state.removeEdge)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {(selected || isHovered) && (
            <button
              type="button"
              className="edge-delete-button"
              aria-label="Delete edge"
              onClick={() => removeEdge(id)}
            >
              <img src={trashIcon} className="delete-icon-image" alt="" aria-hidden />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
