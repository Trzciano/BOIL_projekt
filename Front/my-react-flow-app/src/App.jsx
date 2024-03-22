import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
    { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'B', position: { x: 0, y: 100 }, data: { label: 'B' } },
    { id: 'C', position: { x: 0, y: 200 }, data: { label: 'C' } },
    { id: 'D', position: { x: 0, y: 300 }, data: { label: 'D' } },
    { id: 'E', position: { x: 0, y: 400 }, data: { label: 'E' } },
    { id: 'F', position: { x: 0, y: 500 }, data: { label: 'F' } },
    { id: 'G', position: { x: 0, y: 600 }, data: { label: 'G' } },
    { id: 'H', position: { x: 0, y: 700 }, data: { label: 'H' } },



];
const initialEdges = [
    { id: 'eA-C', source: 'A', target: 'C' },
    { id: 'eA-D', source: 'A', target: 'D' },
    { id: 'eB-E', source: 'B', target: 'E' },
    { id: 'eC-F', source: 'C', target: 'F' },
    { id: 'eC-G', source: 'C', target: 'G' },
    { id: 'eE-H', source: 'E', target: 'H' },
    { id: 'eD-H', source: 'D', target: 'H' },
    { id: 'eF-H', source: 'F', target: 'H' }

];

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}