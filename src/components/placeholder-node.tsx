import React, { useCallback, type ReactNode, forwardRef } from "react";
import {
  useReactFlow,
  useNodeId,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import { BaseNode } from "@/components/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children }, ref) => {
    const id = useNodeId();
    const { setNodes, setEdges } = useReactFlow();

    const handleClick = useCallback(() => {
      if (!id) return;

      setEdges((edges) =>
        edges.map((edge) =>
          edge.target === id ? { ...edge, animated: false } : edge,
        ),
      );

      setNodes((nodes) => {
        const updatedNodes = nodes.map((node) => {
          if (node.id === id) {
            // Customize this function to update the node's data as needed.
            // For example, you can change the label or other properties of the node.
            return {
              ...node,
              data: { ...node.data, label: "" },
              type: "mapNode",
            };
          }
          return node;
        });
        return updatedNodes;
      });
    }, [id, setEdges, setNodes]);

    return (
      <BaseNode
        ref={ref}
        className="w-[150px] border-dashed border-gray-400 bg-card p-2 text-center text-gray-400 shadow-none"
        onClick={handleClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: "hidden" }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type="source"
          style={{ visibility: "hidden" }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  },
);

PlaceholderNode.displayName = "PlaceholderNode";
