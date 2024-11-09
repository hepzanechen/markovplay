import React from 'react';
import {
  getBezierPath,
  useStore,
  BaseEdge,
  type EdgeProps,
  type ReactFlowState,
  EdgeLabelRenderer
} from '@xyflow/react';


export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offsetDistance: number,
) => {
  // Calculate midpoint coordinates
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Calculate the angle of the line connecting source and target
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);

  // Calculate perpendicular offset angle
  const perpendicularAngle = angle + Math.PI / 2;

  // Calculate control point coordinates using trigonometry for symmetry
  const controlX = midX + offsetDistance * Math.cos(perpendicularAngle);
  const controlY = midY + offsetDistance * Math.sin(perpendicularAngle);

  // Create the quadratic Bézier path
  const edgePath = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;

  // Calculate the midpoint of the quadratic Bézier curve for label placement (using t = 0.5)
  const t = 0.5;
  const labelX =
    Math.pow(1 - t, 2) * sourceX +
    2 * (1 - t) * t * controlX +
    Math.pow(t, 2) * targetX;
  const labelY =
    Math.pow(1 - t, 2) * sourceY +
    2 * (1 - t) * t * controlY +
    Math.pow(t, 2) * targetY;

  // Return the path and the calculated label position
  return { path: edgePath, labelX, labelY };
};


export default function CustomEdge({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  label
}: EdgeProps) {
  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target),
    );

    return edgeExists;
  });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = '';
  // Determine if the edge is forward or backward
  const isForward = source < target; // Define forward as source < target

  // Function to get edge style based on direction
  const getEdgeStyle = (isForward) => {
  let strokeColor = 'black'; // Default color for other edges
  strokeColor = isForward ? 'red' : 'blue'; // Red for forward, blue for backward
  return {
    strokeWidth: 2,
    strokeDasharray: '5,5', // Optional dashed line
    stroke: strokeColor,
  };
  };


  // Determine offsets based on the relationship between source and target nodes
  const offset  =  100; // Control leftward/rightward curve

  let labelX, labelY;
  if (isBiDirectionEdge) {
      // Get the special path and label position for bidirectional edge
    const pathResult = getSpecialPath(edgePathParams, offset);
    path = pathResult.path;
    labelX = pathResult.labelX;
    labelY = pathResult.labelY;
  } else {
    [path] = getBezierPath(edgePathParams);
  }
  

  

// Render the edge
return (
  <>
      <BaseEdge path={path} markerEnd={markerEnd} style={getEdgeStyle(isForward)}/>
      {label && (
        <EdgeLabelRenderer>
          <>
            <div
              style={{
                position: 'absolute',
                transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
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