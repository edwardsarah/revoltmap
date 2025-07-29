import { useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow, type Edge, type NodeProps, type Node } from '@xyflow/react';
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
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

  const [text, setText] = useState<string>(data.label ?? "");
  //const [showQuestions, setShowQuestions] = useState(data.showQuestions || false);

  const { addNodes, addEdges, getNode } = useReactFlow();

  function createNewQuestion(questionTypeString: string, spacing: number){
    const sourceNode = getNode(id);
      if (!sourceNode) return;

      const newNodeId = `${id}-${Date.now()}-${Math.floor(Math.random()*10000)}`;

      const newNode = {
        id: newNodeId,
            type: 'question',
            position: {
            x: sourceNode.position.x + (Math.random() - 0.5) * 200 + 100 + spacing,
            y: sourceNode.position.y + (Math.random() - 0.5) * 200 + 100,
          },
            data: { label: "", 
              questionType: questionTypeString}
          }

      const newEdge: Edge = {
            id: `${id}-${newNodeId}`,
            source: id,
            target: newNodeId,
            type: 'customEdge',
            data: {label: ""}
          }
      
      addNodes(newNode);
      addEdges(newEdge);
  }
  
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

  return (
    <div className="map-node">
      <BaseNode style={{ backgroundColor: data.color}}>
        <BaseNodeContent>
          <input
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
