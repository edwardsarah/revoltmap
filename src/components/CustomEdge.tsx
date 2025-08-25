import {BaseEdge, 
        Position,
        getBezierPath, 
        EdgeLabelRenderer} from '@xyflow/react';

import { useState } from 'react';

export type CustomEdgeProps = {
    id: string,
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    sourcePosition: Position,
    targetPosition: Position,
    data: { label: string }
    selected: boolean | undefined //fix this later!
}
 
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected
 }: CustomEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const [text, setText] = useState(data.label || '');
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      {(selected || (text !== "")) && <EdgeLabelRenderer>
        <input
           style={{
            position: 'absolute',
            transform: `translate(-10%, -10%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'auto',
            color: 'gray',
            textWrap: 'wrap'

          }}
           id={text}
           value={text}
           onChange={(e) => setText(e.target.value)}
           placeholder="Tell me about this connection..." 
           className="edge-label-renderer__custom-edge nodrag nopan"
           />
      </EdgeLabelRenderer>}
    </>
  );
}