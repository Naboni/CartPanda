import { Handle, Position } from 'reactflow'

import type { FunnelNodeData } from '../../types'

type BaseNodeProps = {
  data: FunnelNodeData
  accentColor: string
  showSource?: boolean
}

export function BaseNode({ data, accentColor, showSource = true }: BaseNodeProps) {
  return (
    <div className="funnel-node" style={{ borderColor: accentColor }}>
      <Handle type="target" position={Position.Left} className="funnel-node__handle" />
      {showSource && (
        <Handle type="source" position={Position.Right} className="funnel-node__handle" />
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
