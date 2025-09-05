import { NodeToolbar } from '@xyflow/react';
import useStore, {type RFState} from '../../store.ts';
import { IoMdHeart, IoMdHeartEmpty,  } from "react-icons/io";
import { MdOutlineModeComment } from "react-icons/md";

type ShapeNodeToolbarProps = {
  activeColor: string; //delete this
  onColorChange?: (color: string) => void;
  nodeId: string;
};

function ShapeNodeToolbar({
  onColorChange = () => false,
  activeColor,
  nodeId
}: ShapeNodeToolbarProps) {
  const addNote = useStore(state => state.addNote);
  const incrementLikes = useStore(state => state.incrementLikes);

  return (
    <NodeToolbar className="nodrag" offset={16}>
      <button className="xy-theme__button" onClick={() => addNote(nodeId)}>
        <MdOutlineModeComment size="32"/>
      </button>
      <button className="xy-theme__button" onClick={() => incrementLikes(nodeId)}>
        <IoMdHeartEmpty size="32"/>
      </button>
    </NodeToolbar>
  );
}

export default ShapeNodeToolbar;
