import React, { useCallback } from 'react';
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

import ButtonEdge from './ButtonEdge';
import SelfConnectingEdge from './SelfConnectingEdge';
import BiDirectionalEdge from './BiDirectionalEdge';
import BiDirectionalNode from './BiDirectionalNode';




const initialNodes: Node[] = [
  {
    id: 'bi-1',
    data: { label: 'Bi Directional 1' },
    position: { x: 0, y: 300 },
    type: 'bidirectional',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'bi-2',
    data: { label: 'Bi Directional 2' },
    position: { x: 250, y: 300 },
    type: 'bidirectional',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'self-1',
    data: { label: 'Self Connecting' },
    position: { x: 125, y: 500 },
    type: 'bidirectional',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  // Existing bidirectional edges
  {
    id: 'edge-bi-1-to-bi-2',
    source: 'bi-1',
    target: 'bi-2',
    type: 'bidirectional',
    sourceHandle: 'left',
    targetHandle: 'left',
  },
  {
    id: 'edge-bi-2-to-bi-1',
    source: 'bi-2',
    target: 'bi-1',
    type: 'bidirectional',
    sourceHandle: 'right',
    targetHandle: 'right',
  },
  {
    id: 'edge-bi-1-to-self-1',
    source: 'bi-1',
    target: 'self-1',
    type: 'bidirectional',
    sourceHandle: 'left',
    targetHandle: 'left',
  },
  {
    id: 'edge-self-1-to-bi-1',
    source: 'self-1',
    target: 'bi-1',
    type: 'bidirectional',
    sourceHandle: 'right',
    targetHandle: 'right',
  },
  {
    id: 'edge-bi-2-to-self-1',
    source: 'bi-2',
    target: 'self-1',
    type: 'bidirectional',
    sourceHandle: 'left',
    targetHandle: 'left',
  },
  {
    id: 'edge-self-1-to-bi-2',
    source: 'self-1',
    target: 'bi-2',
    type: 'bidirectional',
    sourceHandle: 'right',
    targetHandle: 'right',
  },

  // Self-loop edges
  {
    id: 'edge-bi-1-self',
    source: 'bi-1',
    target: 'bi-1',
    type: 'selfconnecting',
    sourceHandle: 'left',
    targetHandle: 'right',
  },
  {
    id: 'edge-bi-2-self',
    source: 'bi-2',
    target: 'bi-2',
    type: 'selfconnecting',
    sourceHandle: 'left',
    targetHandle: 'right',
  },
  {
    id: 'edge-self-1-self',
    source: 'self-1',
    target: 'self-1',
    type: 'selfconnecting',
    sourceHandle: 'left',
    targetHandle: 'right',
  },
];


const edgeTypes = {
  bidirectional: BiDirectionalEdge,
  selfconnecting: SelfConnectingEdge,
  buttonedge: ButtonEdge,
};

const nodeTypes = {
  bidirectional: BiDirectionalNode,
};

const EdgesFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
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
  );
};

export default EdgesFlow;
