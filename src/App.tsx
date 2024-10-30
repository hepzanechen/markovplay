// THis one mainly draw react Markove flow
import { useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  ConnectionMode,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import SelfConnectingEdge from './components/SelfConnectingEdge';
import BiDirectionalEdge from './components/BiDirectionalEdge';
import BiDirectionalNode from './components/BiDirectionalNode';
import MatrixInputForm from './components/MatrixInput';
import validateMatrix from './utils/validateMatrix';


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


const createNodes = (n, stateNames) => {
  const radius = Math.max(50*n,200);
  return Array.from({ length: n }, (_, i) => {
    const angle = (i * 2 * Math.PI) / n + 0.1;
    return {
      id: `node-${i}`,
      data: { label: stateNames[i] },
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
  return Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);
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
const createEdges = (matrix, nodesArray) => {
  const edges = [];
  const nodes = new Map(nodesArray.map((node) => [node.id, node]));
  matrix.forEach((row, from) => {
    row.forEach((probability, to) => {
      if (probability > 0) {
        const edge: Edge = {
          id: `edge-${from}-${to}`,
          source: `node-${from}`,
          target: `node-${to}`,
          label: probability.toFixed(2),
          animated: true,
        };

        if (from === to) {
          edge.type = 'selfconnecting';
          edge.sourceHandle = 'left';
          edge.targetHandle = 'right';
        } else {
          const sourceNode = `node-${from}`;
          const targetNode = `node-${to}`;

          const source = nodes.get(sourceNode);
          const target = nodes.get(targetNode);

          if (source && target) {
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

            const sourceHandle = determineHandlePosition(angle);
            const targetHandle = determineHandlePosition(targetHandleAngle);

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

// Main component to visualize the Markov chain
const MarkovChainFlow = () => {
  const [size, setSize] = useState(6); // Default size
  const [stateNames, setStateNames] = useState(Array.from({ length: size }, (_, i) => `State ${String.fromCharCode(65 + i)}`));
  const [matrix, setMatrix] = useState(createMatrix(size));
  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes(size,stateNames));
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges(matrix, nodes));

  
  const [error, setError] = useState(null);

  useEffect(() => {
    const validationError = validateMatrix(matrix);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      const newNodes = createNodes(size, stateNames);
      setNodes(newNodes);
      setEdges(createEdges(matrix, newNodes)); // Use updated nodes here
    }
  }, [size, matrix, stateNames]);


  return (
    <div className="container">
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Markov Chain Visualizer</p>
          <p className="subtitle">Interactive Markov Chain Playground</p>
        </div>
      </section>
      <section className="section">
        <div className="columns">
          <div className="column is-one-third">
            <div className="box">
              <h4 className="title is-4">Input Form</h4>
              <MatrixInputForm
                size={size}
                setSize={setSize}
                setMatrix={setMatrix}
                setStateNames={setStateNames}
              />
              {error && <div className="notification is-danger">{error}</div>}
            </div>
          </div>
          <div className="column">
            <div className="box" style={{ width: '100%', height: '50vh' }}>
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
        </div>
      </section>
    </div>
  );
};

export default MarkovChainFlow;
