import { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Position,
  ConnectionMode,
  MarkerType,
  type OnConnect,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import SelfConnectingEdge from './SelfConnectingEdge';
import BiDirectionalEdge from './BiDirectionalEdge';
import BiDirectionalNode from './BiDirectionalNode';
import MatrixInputForm from './MatrixInput';


// Create matrix of transition probabilities
const createMatrix = (n) => {
  const matrix = Array.from({ length: n }, () => Array(n).fill(1 / n));
  return matrix;
};
const edgeTypes = {
  bidirectional: BiDirectionalEdge,
  selfconnecting: SelfConnectingEdge,
};

const nodeTypes = {
  bidirectional: BiDirectionalNode,
};
// Create nodes for the Markov chain
const createNodes = (n) => {
  const radius = 250;
  return Array.from({ length: n }, (_, i) => {
    const angle = (i * 2 * Math.PI) / n+0.1;
    return {
      id: `node-${i}`,
      data: { label: `State ${String.fromCharCode(65 + i)}` },
      position: {
        x: 200 + radius * Math.cos(angle),
        y: 200 + radius * Math.sin(angle),
      },
      type: 'bidirectional', 

    };
  });
};
// Function to calculate angle between two points
const calculateAngle = (sourceX, sourceY, targetX, targetY) => {
  return Math.atan2(targetY - sourceY,targetX - sourceX) * (180 / Math.PI);
};

// Function to determine handle position based on angle
const determineHandlePosition = (angle) => {
  if (angle >= -45 && angle < 45) {
    return 'right';
  } else if (angle >= -135 && angle < -45) {
    return 'top';
  } else if (angle >= 45 && angle < 135) {
    return 'bottom';
  } else {
    return 'left';
  }
};
// Create edges based on the transition matrix
const createEdges = (matrix,nodesArray) => {
  const edges = [];
  // Convert nodes array to a Map for fast access by ID
  const nodes = new Map(nodesArray.map((node) => [node.id, node]));
  matrix.forEach((row, from) => {
    row.forEach((probability, to) => {
      if (probability > 0) {
        const edge: Edge= {
          id: `edge-${from}-${to}`, // Edge ID format
          source: `node-${from}`,    // Source matches node ID
          target: `node-${to}`,      // Target matches node ID
          label: probability.toFixed(2), // Label for the edge
          animated: true, // Enable animation for better visualization
        };

        // Handle self-connecting edges separately
        if (from === to) {
          edge.type = 'selfconnecting';
          edge.sourceHandle = 'left';
          edge.targetHandle = 'right';
        } 
        // Handle bidirectional edges
        else {
          const sourceNode = `node-${from}`;
          const targetNode = `node-${to}`;

          // Access nodes using the Map for O(1) lookup
          const source = nodes.get(sourceNode);
          const target = nodes.get(targetNode);

          if (source && target) {
            // Calculate the angle between the source and target nodes
            const angle = calculateAngle(
              source.position.x,
              source.position.y,
              target.position.x,
              target.position.y
            );
            let targetHandleAngle;

            if (angle < 0) {
              targetHandleAngle = angle + 180;
            } else {
              targetHandleAngle = angle - 180;
            }
            // Determine the handle positions dynamically based on the angle
            const sourceHandle = determineHandlePosition(angle);
            const targetHandle = determineHandlePosition(targetHandleAngle); // Opposite handle for the target

            edge.type = 'bidirectional';
            edge.sourceHandle = sourceHandle;
            edge.targetHandle = targetHandle;
          }
        }

        edges.push(edge);
      }
    });
  });

  return edges;
};

// Function to display the transition matrix


// Main component to visualize the Markov chain
const MarkovChainFlow = () => {
  const [size, setSize] = useState(6); // Default size
  const [matrix, setMatrix] = useState(createMatrix(size));
  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes(size));
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges(matrix,nodes));

  useEffect(() => {
    setNodes(createNodes(size));
    setEdges(createEdges(matrix,nodes));
  }, [size, matrix]);

  return (
    <div>
    <MatrixInputForm size={size} setSize={setSize} setMatrix={setMatrix} setStateNames={setStateNames} />
    <div style={{ width: '100%', height: '50vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid={true}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        connectionMode={ConnectionMode.Loose}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
    </div>
  );
};

export default MarkovChainFlow;