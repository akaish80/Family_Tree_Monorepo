"use client";

import React, { forwardRef } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
} from 'reactflow';
import InputNode from './InputNode';
import NonEditableNode from './NonEditableNode';

import 'reactflow/dist/style.css';

// Define node types
const nodeTypes = {
    input: InputNode,
    START: NonEditableNode,
    END: NonEditableNode,
};

interface FlowEditorCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

const FlowEditorCanvas = forwardRef<HTMLDivElement, FlowEditorCanvasProps>(({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onNodeClick,
}, ref) => {
    return (
        <div
            ref={ref}
            style={{ 
                width: '100vw', 
                height: '100vh', 
                marginLeft: 180, 
                marginRight: 240 
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={{ background: 'transparent' }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
            >
                <Controls
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                />
                <MiniMap
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                    maskColor="rgba(100, 116, 234, 0.1)"
                />
                <Background 
                    gap={20} 
                    size={1} 
                    color="rgba(255, 255, 255, 0.3)" 
                />
            </ReactFlow>
        </div>
    );
});

FlowEditorCanvas.displayName = 'FlowEditorCanvas';

export default FlowEditorCanvas;