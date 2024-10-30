import React, { memo } from 'react';
import {
  type BuiltInNode,
  type NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
//TODO: make node size and lable size paramrized
const style = {
  width: 100,       //This decides lable positon, also numerical
  height: 100,
  borderRadius: '50%', // Makes the node circular
  background: '#61dafb', // Light blue background
  border: '2px solid #333', // Dark border
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff', // White text color
  fontWeight: 'bold',
};

const BiDirectionalNode = ({ data }: NodeProps<BuiltInNode>) => {
  return (
    <div style={style}>
      {/* Handle for the four sides */}
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      {data?.label}
    </div>
  );
};

export default memo(BiDirectionalNode);
