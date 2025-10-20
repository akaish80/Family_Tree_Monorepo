import React, { useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";
import InputNode from '../../../components/InputNode';
import NonEditableNode from '../../../components/NonEditableNode';

const nodeTypes = {
    input: InputNode,
    START: NonEditableNode,
    END: NonEditableNode
};

interface FlowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: any[]) => void;
    onEdgesChange: (changes: any[]) => void;
    onConnect: OnConnect;
    onNodeClick: (event: any, node: Node) => void;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    handleNodeSaved: (nodeData: { id: string; name: string }) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onDrop,
    onDragOver,
    handleNodeSaved,
}) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Update nodes with the handleNodeSaved callback
    const updatedNodes = nodes.map(node => {
        if (node.type === 'input') {
            return {
                ...node,
                data: {
                    ...node.data,
                    onNodeSaved: handleNodeSaved,
                },
            };
        }
        return node;
    });

    return (
        <div
            ref={reactFlowWrapper}
            style={{ width: '100vw', height: '100vh', marginLeft: 180, marginRight: 240 }}
        >
            <ReactFlow
                nodes={updatedNodes}
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
                <Background gap={20} size={1} color="rgba(255, 255, 255, 0.3)" />
            </ReactFlow>
        </div>
    );
};