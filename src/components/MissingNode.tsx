import { useEffect, useRef, useState } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import {
  BaseNode,
  BaseNodeContent
} from "@/components/base-node";

import useStore from './../store.ts';
import { dot } from 'node:test/reporters';


export type MapNodeData = {
  label: string;
  showQuestions: boolean;
  color: string;
}

export type MapNode = Node<MapNodeData>;

function MapNode({ id, data, selected }:NodeProps<MapNode> ) {

  const updateText = useStore((state) => state.updateText);

  const [text, setText] = useState<string>(data.label ?? "");

  useEffect(() => {
    if (text !== data.label) {
      updateText(id, text);
    }
  }, [text])

  return (
    <div >
      <BaseNode className="missing-node" style={{ border: "red dotted"}}>
        <BaseNodeContent>
          <textarea
           id={id}
           value={text}
           onChange={(e) => setText(e.target.value)}
           placeholder="What's missing from this graph?" />
        </BaseNodeContent>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Right} id="a" />
          <Handle type="source" position={Position.Bottom} />
      </BaseNode>
    </div>
  );
}

export default MapNode;