import { useEffect, useState } from 'react';

import {
  BaseNode,
  BaseNodeContent,
  //BaseNodeFooter,
} from "./base-node";
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
//import { ArrowDownRight } from "lucide-react";

import useStore from './../store.ts';

export type AnnotationNodeData = {
    label: string;
    color: string;
}

export type AnnotationNode = Node<AnnotationNodeData>;

function AnnotationNode({ id, data }: NodeProps<AnnotationNode>) {
    const [text, setText] = useState<string>(data.label ?? "");

    const updateText = useStore((state) => state.updateText);

    useEffect(() => {
        if (text !== data.label) {
            updateText(id, text);
        }
  }, [text])

    return (
        <BaseNode style={{ color: data.color, backgroundColor: 'transparent'}}>
        <BaseNodeContent className="pb-0 leading-snug">
            <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment or note!" />
        </BaseNodeContent>
            <Handle type="target" position={Position.Bottom} />
        </BaseNode>
  );
}

export default AnnotationNode;