import SidebarItem from './sidebar-item';
import { ShapeComponents, type ShapeNode, type ShapeType } from '../shape/types/index.ts';
import { Lasso } from '../Lasso.tsx';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useStore, {type RFState} from '../../store.ts';
import {
    type Edge,
    type Node,
} from '@xyflow/react';

const colors = [
  '#CF4C2C',
  '#EA9C41',
  '#EBC347',
  '#438D57',
  '#3F8AE2',
  '#803DEC',
];

const selector = (state: RFState) => ({
  edges: state.edges,
  nodes: state.nodes,
  isLassoActive: state.isLassoActive,
  enableLasso: state.enableLasso,
  disableLasso: state.disableLasso,
  changeColor: state.changeColor,
})

function Sidebar() {

  const { edges, nodes, isLassoActive, enableLasso, disableLasso, changeColor} = useStore(useShallow(selector));

  const [partial, setPartial] = useState(true);

  //logic for connections made - omits edges that connect annotation or question nodes, which aren't connections! 
  const validNodes: Node[] = nodes.filter(node => node.type === "shapeMap");
  const validNodeIds: string[] = validNodes.map(node => node.id);
  const validEdges: Edge[] = edges.filter(edge => (validNodeIds.includes(edge.source) && validNodeIds.includes(edge.target)));
  
    const getTopLikedNodes = () => {
    return nodes
      .filter(node => node.data && typeof node.data.likes === 'number' && node.data.likes > 0)
      .sort((a, b) => (b.data?.likes ) - (a.data?.likes))
      .slice(0, 3)
      .map(node => node.data.label || 'Unnamed Node');
  };

  const topNodes = getTopLikedNodes();

  return (
    <div className="w-64 p-4 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="sidebar-label">Drag shapes to the canvas</div>
      <div className="sidebar-items">
        {Object.keys(ShapeComponents).map((type) => (
          <SidebarItem type={type as ShapeType} key={type} />
        ))}
      </div>
      <div className="sidebar-label">Selection Mode</div>
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
          <label>
            <input
              type="checkbox"
              checked={partial}
              onChange={() => setPartial((p) => !p)}
              className="xy-theme__checkbox"
            />
            Partial selection
          </label>
        </div>  
        <label>
          Color Picker
          <br />
            {colors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => changeColor(color)}
                className="color-swatch"
              />
        ))}
        </label>
        <br />
        <label> 
          Statistics - 
          <p><b>Connections Made:</b> {validEdges.length} </p>
          <label>
            <b>Favorite Things Today: </b>
            <ol>
              <li>1. {topNodes[0]} </li>
              <li>2. {topNodes[1]} </li>
              <li>3. {topNodes[2]} </li>
            </ol>
          </label>
        </label>
    </div>
  );
}

export default Sidebar;