import { useCallback, useState } from 'react';
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
        //type Node,
        type Edge
 } from '@xyflow/react';

import { useShallow } from 'zustand/shallow';
import '@xyflow/react/dist/style.css';
import MapNode from './components/MapNode.tsx';
import CustomEdge from './components/CustomEdge.tsx'
import Question from './components/Question.tsx';
import AnnotationNode from './components/AnnotationNode.tsx';
import useStore, {type RFState} from './store.ts';
import DownloadButton from './components/DownloadButton.tsx';
import { Lasso } from './components/Lasso.tsx'
import useForceLayout from './useForceLayout.ts';
//import { create } from 'domain';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  createQuestions: state.createQuestions,
  isLassoActive: state.isLassoActive,
  enableLasso: state.enableLasso,
  disableLasso: state.disableLasso,
  addNode: state.addNode,
  addNote: state.addNote
})

const nodeTypes = {
  mapNode: MapNode,
  question: Question,
  annotation: AnnotationNode
};

const edgeTypes = { 
  customEdge: CustomEdge
};

const defaultEdgeOptions = {
  type: 'customEdge',
  data: {label: ''}
}
 
export default function App() {
  //setting up initial nodes and edges
/*
  const initialNodes: Node[] = [
  {id: '1', type: 'question', position: {x: 500, y: 500}, data: {label: "", questionType: "intro"}}
  ];
  */
  const initialEdges: Edge[] = [];

  //hooks for updating nodes and edges! 
  const { nodes, edges, onNodesChange, onEdgesChange, createQuestions, isLassoActive, enableLasso, disableLasso, addNode, addNote } = useStore(useShallow(selector));
  const updateNodeColor = useStore((state) => state.changeColor);

  //const setNodes = useNodesState(initialNodes)[1];
  const setEdges = useEdgesState(initialEdges)[1];
  console.log(createQuestions, useNodesState) //delete this later

  // check box for partial selection
  const [partial, setPartial] = useState(true);
  
  //types of nodes and edges - keys indicate a string to reference the node in type, the value is the actual object called to render

  //const getNodeId = () => `randomnode_${+new Date()}`; //change this so there's consistency across nodes
  
  const strength = -1200;
  const distance = 150;

  const dragEvents = useForceLayout({ strength, distance });

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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        //@ts-expect-error
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodeDragStart={dragEvents.start}
        onNodeDrag={dragEvents.drag}
        onNodeDragStop={dragEvents.stop}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        {isLassoActive && <Lasso partial={partial} />}
        <Controls /> 
        <Panel position="top-left">Revolt Map
          <div className="xy-theme__button-group">
            <button
              className={`xy-theme__button ${isLassoActive ? 'active' : ''}`}
              onClick={enableLasso}
            >
              Lasso Mode
            </button>
            <button
              className={`xy-theme__button ${!isLassoActive ? 'active' : ''}`}
              onClick={disableLasso}
            >
              Selection Mode
            </button>
            <input type="color"
                  onChange={(evt) => updateNodeColor(evt.target.value)}></input>
          </div>
 
          <label>
            <input
              type="checkbox"
              checked={partial}
              onChange={() => setPartial((p) => !p)}
              className="xy-theme__checkbox"
            />
            Partial selection
          </label>
        </Panel>
        <MiniMap /> 
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <DownloadButton />
          <button className="xy-theme__button" onClick={onSave}>
            Save
          </button>
          <button className="xy-theme__button" onClick={onRestore}>
            Restore
          </button>
          <button className="xy-theme__button" onClick={addNode}>
            Add Node
          </button>
          <button className="xy-theme__button" onClick={addNote}>
            Add Note
          </button>
      </Panel>
      </ReactFlow>
    </div>
  );
}