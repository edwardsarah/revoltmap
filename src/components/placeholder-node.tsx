import { useCallback, type ReactNode, forwardRef } from "react";
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
  data: {
    category: string;
  }
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, data }, ref) => {
    const id = useNodeId();
    const { setNodes, setEdges } = useReactFlow();

    let shape = "rectangle";

    if (data.category == 'people'){
      shape = 'rectangle'
      console.log("This is a people node!")
    } else if (data.category == 'org'){
      shape = 'round-rectangle'
      console.log("This is an org node!")
    } else if (data.category == 'movement'){
      shape = 'hexagon'
    } else if (data.category == 'other'){
      console.log("This is an other node!") //FIX LATER
    } else if (data.category == 'intro'){
      console.log("This is an intro node!") //FIX LATER
    } else {
      console.error("Invalid node type.")} //FIX LATER

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
              height: 100, //these always need to be defined otherwise it will expand without end
              width: 150,
              data: { ...node.data, label: "", type: shape, showQuestions: false, color: "#FFFFFF", likes: 0 },
              type: "shapeMap",
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
