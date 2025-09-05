import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NodeResizer,
  type NodeProps,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from '@xyflow/react';

import Shape from '../shape/index.tsx';
import ShapeNodeToolbar from '../toolbar/index.tsx';
import { type ShapeNode } from '../shape/types/index.ts';
import useStore from '../../store.ts';

const handlePositions = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
];

function ShapeMapNode({
  id,
  selected,
  data,
  width,
  height,
}: NodeProps<ShapeNode>) {
  const { color, type, label, likes } = data;
  const { updateNodeData } = useReactFlow();
  const shiftKeyPressed = useKeyPress('Shift');

  const onColorChange = useCallback(
    (color: string) => {
      updateNodeData(id, { color });
    },
    [id, updateNodeData]
  );

  const createQuestions = useStore((state) => state.createQuestions);
  const cleanUpGraph = useStore((state) => state.cleanUpGraph);
  const isLassoActive = useStore((state) => state.isLassoActive)
  const updateText = useStore((state) => state.updateText);
  const resetLikes = useStore((state) => state.resetLikes);

  const [text, setText] = useState<string>(data.label ?? "");
  
  const hasCreatedQuestions = useRef(false);

  useEffect(() => {
    if (selected && !hasCreatedQuestions.current && !isLassoActive) {
      cleanUpGraph();
      createQuestions(id, "people", 100)
      createQuestions(id, "org", 200)
      createQuestions(id, "movement", 300)
      createQuestions(id, "other", 400)
      /*
      createNewQuestion("people", 100)
      createNewQuestion("org", 200)
      createNewQuestion("movement", 300)
      createNewQuestion("other", 400) */
      hasCreatedQuestions.current = true
    } 
    if (!selected) {
      hasCreatedQuestions.current = false;
    }

  }, [selected]);

  useEffect(() => {
    if (text !== data.label) {
      updateText(id, text);
      resetLikes(id); // reset likes when text changes to prevent abuse of like feature! 
    }
  }, [text])

  return (
    <>
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />
      <ShapeNodeToolbar onColorChange={onColorChange} activeColor={color} nodeId={id}/>
      <Shape
        type={type}
        width={width}
        height={height}
        fill={color}
        strokeWidth={2}
        stroke={color}
        fillOpacity={0.8}
      />
    <textarea
           id={id}
           value={text}
           onChange={(e) => setText(e.target.value)}
           className="node-label"
           placeholder="Type something..." />

      {handlePositions.map((position) => (
        <Handle
          id={position}
          style={{ backgroundColor: color }}
          type="source"
          position={position}
          //add some stuff here about connecting
          isConnectable={true}
        />
      ))}
    </>
  );
}

export default ShapeMapNode;

//<input type="text" className="node-label" placeholder={type} />