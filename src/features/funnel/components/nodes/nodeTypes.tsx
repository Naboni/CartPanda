import type { NodeProps } from 'reactflow'

import { nodeColors } from '../../constants/nodeColors'
import type { FunnelNodeData } from '../../types'
import { BaseNode } from './BaseNode'

type FunnelNodeProps = NodeProps<FunnelNodeData>

export const nodeTypes = {
  sales: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor={nodeColors.sales} selected={selected} />
  ),
  order: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor={nodeColors.order} selected={selected} />
  ),
  upsell: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor={nodeColors.upsell} selected={selected} />
  ),
  downsell: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor={nodeColors.downsell} selected={selected} />
  ),
  thankyou: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor={nodeColors.thankyou} showSource={false} selected={selected} />
  ),
}
