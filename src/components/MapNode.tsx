import { useEffect, useRef, useState } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import {
  BaseNode,
  BaseNodeContent
} from "@/components/base-node";

import useStore from './../store.ts';


export type MapNodeData = {
  label: string;
  showQuestions: boolean;
  color: string;
}

export type MapNode = Node<MapNodeData>;

function MapNode({ id, data, selected }:NodeProps<MapNode> ) {
  const createQuestions = useStore((state) => state.createQuestions);
  const cleanUpGraph = useStore((state) => state.cleanUpGraph);
  const isLassoActive = useStore((state) => state.isLassoActive)
  const updateText = useStore((state) => state.updateText);

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
    }
  }, [text])

  return (
    <div className="map-node">
      <BaseNode style={{ backgroundColor: data.color}}>
        <BaseNodeContent>
          <textarea
           id={id}
           value={text}
           onChange={(e) => setText(e.target.value)}
           placeholder="Type something..." />
        </BaseNodeContent>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Right} id="a" />
          <Handle type="source" position={Position.Bottom} />
      </BaseNode>
    </div>
  );
}

export default MapNode;
