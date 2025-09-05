import { type DragEvent, type DragEventHandler } from 'react';
import { useCallback, useState } from 'react';
import { ReactFlow,
    useReactFlow,
        MiniMap,
        Panel,
        Controls,
        Background,
        BackgroundVariant,
        ConnectionMode,
        useNodesState,
        useEdgesState,
        addEdge,
        type Connection,
        //type Node,
        type Edge,
        type SnapGrid
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
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import MiniMapNode from './components/minimap-node';
import ShapeMapNode from './components/shape-node/shapemapnode.tsx';
import { type ShapeNode, type ShapeType } from './components/shape/types';
import useCursorStateSynced from './collaborationutils/useCursorStateSynced.tsx';
import Cursors from './collaborationutils/Cursors.tsx';
//import { create } from 'domain';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
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
  annotation: AnnotationNode,
  shape: ShapeNodeComponent,
  shapeMap: ShapeMapNode
};

const edgeTypes = { 
  customEdge: CustomEdge
};

const defaultEdgeOptions = {
  type: 'customEdge',
  data: {label: ''}
}
 
export default function App() {


  //hooks for updating nodes and edges! 
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, createQuestions, isLassoActive, enableLasso, disableLasso, addNode, addNote } = useStore(useShallow(selector));
  const updateNodeColor = useStore((state) => state.changeColor);

  //managing collaborative tools
  const [cursors, onMouseMove] = useCursorStateSynced();

  // check box for partial selection
  const [partial, setPartial] = useState(true);
  
  //FORCE LAYOUT VARIABLES
  const strength = -1200;
  const distance = 150;

  const dragEvents = useForceLayout({ strength, distance });

//shapes example start
  const snapGrid: SnapGrid = [10, 10];
  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeNode>();

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = { //type here is wrong and needs to be fixed! 
      id: Date.now().toString(),
      type: 'shapeMap',
      position,
      style: { width: 100, height: 100 },
      data: {
        type,
        color: '#FAFAFA',
        label: "",
        showQuestions: false,
        likes: 0
      },
      selected: true,
    };

    setNodes((nodes) =>
      (nodes.map((n) => ({ ...n, selected: false })) as ShapeNode[]).concat([ //i think this is fucking me up
        newNode,
      ])
    );
  };
  //shapes example end

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPointerMove={onMouseMove} //for collaborative cursors
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        //@ts-expect-error Custom edge type compatibility will be fixed later
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodeDragStart={dragEvents.start}
        onNodeDrag={dragEvents.drag}
        onNodeDragStop={dragEvents.stop}
        defaultEdgeOptions={defaultEdgeOptions}
        onDrop={onDrop} //shapes exanple
        snapGrid={snapGrid} //shapes example
        onDragOver={onDragOver} //shapes example
        fitView
      >
        {isLassoActive && <Lasso partial={partial} />}
        <Controls /> 
        <Panel position="top-left">How can we map the things we love?
          <Sidebar />
        </Panel>
        <MiniMap zoomable draggable nodeComponent={MiniMapNode} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <DownloadButton />
          <button className="xy-theme__button" onClick={addNode}>
            Start with a New Prompt!
          </button>
      </Panel>
      <Cursors cursors={cursors} />
      </ReactFlow>
    </div>
  );
}