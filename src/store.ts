import {
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
    type OnNodesChange,
    type OnEdgesChange, 
    applyNodeChanges,
    applyEdgeChanges
} from '@xyflow/react';

import { createWithEqualityFn } from 'zustand/traditional';

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    createQuestions: (sourceId: string, questionType: string, spacing: number) => void;
    cleanUpGraph: () => void;
    isLassoActive: boolean;
    enableLasso: () => void;
    disableLasso: () => void;
    addNode: () => void;
    changeColor: (color: string) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [
            {id: '1', 
            type: 'question', 
            position: {x: 500, y: 500}, 
            data: {label: "", 
                    questionType: "intro"}}
  ],

  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  createQuestions: (sourceId, questionType, spacing) => {
      const sourceNode = get().nodes.find((node: Node) => node.id === sourceId);
      if (!sourceNode) return; 

      const newNodeId = `${sourceId}-${Date.now()}-${Math.floor(Math.random()*10000)}`;

      const newNode = {
        id: newNodeId,
            type: 'question',
            position: {
            x: sourceNode.position.x + (Math.random() - 0.5) * 200 + 100 + spacing,
            y: sourceNode.position.y + (Math.random() - 0.5) * 200 + 100,
          },
            data: { label: "", 
              questionType: questionType}
          }

      const newEdge: Edge = {
            id: `${sourceId}-${newNodeId}`,
            source: sourceId,
            target: newNodeId,
            type: 'customEdge',
            data: {label: ""}
          }

      set({
        nodes: [...get().nodes, newNode],
        edges: [...get().edges, newEdge],
      });
  },

  cleanUpGraph: () => {
    const currentNodes = get().nodes;
    const currentEdges = get().edges;

    const cleanedNodes = currentNodes.filter((node => {
        if(node.type === 'question' && !node.selected){
            return false //removes any question nodes that aren't selected
        }
        return true; //may change this later to remove blank map nodes
    }))

    const cleanedNodeIds = cleanedNodes.map(node => node.id)

    const cleanedEdges = currentEdges.filter(edge => (cleanedNodeIds.includes(edge.source) && cleanedNodeIds.includes(edge.target)))

    set({
        nodes: cleanedNodes,
        edges: cleanedEdges
    })
  }, 

  isLassoActive: false,
  enableLasso: () => {
    console.log("Lasso enabled!")
    set({isLassoActive: true})
  },

  disableLasso: () => {
    console.log("Lasso disabled!")
    set({isLassoActive: false})
  },

  addNode:() => {
    const newNode = {
      id: `randomnode_${+new Date()}`,
      type: "question",
      data: { label: '', questionType: "other" },
      position: {
        x: (Math.random()) * 400,
        y: (Math.random()) * 400,
      },
    };
    set({nodes: [...get().nodes, newNode]})
  },

  changeColor: (color: string) => {
    set({
      nodes: get().nodes.map((node => {
        if (node.selected) {
          return {...node, data: {...node.data, color}}
        }

        return node;
      }))
    })
  }

}));

export default useStore;