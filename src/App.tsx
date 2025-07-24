import { useCallback } from 'react';
import { ReactFlow,
        MiniMap,
        Panel,
        Controls,
        Background,
        BackgroundVariant,
        useNodesState,
        useEdgesState,
        addEdge,
        type Connection,
        type Node,
        type Edge
 } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import MapNode from './components/MapNode.tsx';
import CustomEdge from './components/CustomEdge.tsx'
import Question from './components/Question.tsx';
 
export default function App() {
  //setting up initial nodes and edges
  const initialNodes: Node[] = [
  {id: '1', type: 'question', position: {x: 500, y: 500}, data: {label: "", questionType: "intro"}}
  ];
  const initialEdges: Edge[] = [];

  //hooks for updating nodes and edges! 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  //types of nodes and edges - keys indicate a string to reference the node in type, the value is the actual object called to render
  const nodeTypes = {
    mapNode: MapNode,
    question: Question
  };
  const edgeTypes = {
    customEdge: CustomEdge,
  };

  const getNodeId = () => `randomnode_${+new Date()}`; //change this so there's consistency across nodes
 
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onRestore = () => {
    console.log("not implemented yet!")
  }

  const onSave = () => {
    console.log("not implemented yet!")
  }

    const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "question",
      data: { label: '', questionType: "other" },
      position: {
        x: (Math.random()) * 400,
        y: (Math.random()) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  /*

  function getNodeById(id: string): Node{
    const foundNode = nodes.find(node => id === node.id)

    if(!foundNode){
      throw console.error("No node exists with that id");
    }

    return foundNode;}

  function clearUnusedNodes(): void {
    const usedNodes = nodes.filter(node => node.type !== "question")

    setNodes(usedNodes);
  } */

/*
  function cleanUpGraph() {
    const currentNodes = getNodes();

    const cleanedNodes = currentNodes.filter(node => {
      if (node.selected) return true; // Always keep selected nodes

      if (node.type === 'question') {
      // Remove unselected placeholders
      return false;
    }

    if (node.type === 'map') {
      // Keep if it has text
      return node.data?.label?.trim().length > 0;
    }

    // Keep all other types by default
    return true;
  });

  setNodes(cleanedNodes);
}
  */


    // filter for placeholder nodes
    // iterate through all of the edges conneced to that node
    // helper function to get node by ID? and return an error if it doesn't exist
    // if none of those nodes are the currently selected node
    // delete the node

 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        defaultEdgeOptions={{
          type: 'customEdge',
          data: {label: ''}
        }}
      >
        <Controls /> 
        <Panel position="top-left">Revolt Map</Panel>
        <MiniMap /> 
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <button className="xy-theme__button" onClick={onSave}>
            save
          </button>
          <button className="xy-theme__button" onClick={onRestore}>
            restore
          </button>
          <button className="xy-theme__button" onClick={onAdd}>
            add node
          </button>
      </Panel>
      </ReactFlow>
    </div>
  );
}