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

  return (
    <div className="funnel-node" style={{ borderColor: accentColor }}>
      <Handle type="target" position={Position.Left} className="funnel-node__handle" />
      {showSource && (
        <Handle type="source" position={Position.Right} className="funnel-node__handle" />
      )}
      {selected && (
        <button
          type="button"
          className="node-delete-button"
          aria-label="Delete node"
          onClick={() => removeNode(id)}
        >
          <img src={trashIcon} className="delete-icon-image" alt="" aria-hidden />
        </button>
      )}
      <div className="funnel-node__header">
        <div className="funnel-node__icon" style={{ backgroundColor: accentColor }} aria-hidden />
        <div>
          <p className="funnel-node__label">{data.title}</p>
          <p className="funnel-node__type">{data.type.replace('thankyou', 'thank you')}</p>
        </div>
      </div>
      <div className="funnel-node__footer">
        <span className="funnel-node__button">{data.buttonLabel}</span>
      </div>
    </div>
  )
}
