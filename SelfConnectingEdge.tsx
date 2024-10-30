import React from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer ,type EdgeProps,type Edge } from '@xyflow/react';

// Function to get edge style based on direction
const getEdgeStyle = () => {

  return {
    strokeWidth: 2,
    strokeDasharray: '5,5', // Optional dashed line
    stroke: 'green',
  };
  };
export default function SelfConnecting(props: EdgeProps & { label?: string }) {
  // we are using the default bezier edge when source and target ids are different
  if (props.source !== props.target) {
    return <BezierEdge {...props} />;
  }
  const { sourceX, sourceY, targetX, targetY, id, markerEnd, label} = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;
//TODO: make node size and lable size paramrized
  // Render the edge and the label (if label is provided)
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={getEdgeStyle()} />
      {label && (
        <EdgeLabelRenderer>
          <>
            <div
              style={{
                position: 'absolute',
                transform: `translate(${sourceX + 54}px, ${sourceY + 70}px) translate(-50%, -50%)`,
                background: '#E0E0E0',
                padding: 5,
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 700,
              }}
              className="nodrag nopan"
            >
              {label}
            </div>
          </>
        </EdgeLabelRenderer>
      )}
    </>
  );
}