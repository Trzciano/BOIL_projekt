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
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } },
    { id: '4', position: { x: 200, y: 0 }, data: { label: '4' } },
    { id: '5', position: { x: 200, y: 100 }, data: { label: '5' } },
    { id: '6', position: { x: 200, y: 200 }, data: { label: '6' } },
    { id: '7', position: { x: 400, y: 100 }, data: { label: '7' } },
    { id: '8', position: { x: 600, y: 100 }, data: { label: '8' } },
    { id: '9', position: { x: 700, y: 100 }, data: { label: '9' } },
];

const initialEdges = [
    { id: 'A', source: '1', target: '2', label: 'A 3' },
    { id: 'B', source: '2', target: '3', label: 'B 4' },
    { id: 'C', source: '2', target: '4', label: 'C 6' },
    { id: 'D', source: '3', target: '5', label: 'D 7' },
    { id: 'E', source: '5', target: '7', label: 'E 7' },
    { id: 'F', source: '4', target: '7', label: 'F 7' },
    { id: 'G', source: '4', target: '6', label: 'G 7' },
    { id: 'H', source: '6', target: '7', label: 'H 7' },
    { id: 'I', source: '7', target: '8', label: 'I 7' },
    { id: 'J', source: '8', target: '9', label: 'J 7' }

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
