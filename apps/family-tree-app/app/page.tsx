"use client";

import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import InputNode from './components/InputNode';
import NonEditableNode from './components/NonEditableNode';
import BottomBar from './components/BottomBar';

import { SetStateAction, useCallback, useRef, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type OnConnect,
    type Node,
    type Edge,
    Position,
    Handle,
} from 'reactflow';

import 'reactflow/dist/style.css';
import EditNodeModal from './components/EditNodeModal';

// Custom Input Node Component
// ...existing code...

const nodeTypes = {
    input: InputNode,
    START: NonEditableNode,
    END: NonEditableNode,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'START',
        position: { x: 400, y: 50 },
        data: {
            label: 'START'
        },
        style: {
            background: '#e1f5fe',
            border: '2px solid #01579b',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 180,
        },
    },
    {
        id: '2',
        type: 'DECISION',
        position: { x: 396, y: 153 },
        data: {
            label: 'decide',
            choices: [
                {
                    nextNode: '3',
                    nextNodeLabel: 'Node_With_Query_Param',
                    expression: "type:queryParam~key:tenant~value:test",
                },
                {
                    nextNode: '4',
                    nextNodeLabel: 'Node_With_Our_Query_Param',
                    expression: 'DEFAULT'
                }
            ]
        },
        style: {
            background: '#e8f5e8',
            border: '2px solid #2e7d32',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 160,
        },
    },
    {
        id: '3',
        type: 'VIEW',
        position: { x: 616, y: 271 },
        data: {
            label: "param-node",
            transientData: "Found in Query Param",
        },
        style: {
            background: '#fce4ec',
            border: '2px solid #c2185b',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 160,
        },
    },
    {
        id: '4',
        type: 'VIEW',
        position: { x: 313, y: 279 },
        data: {
            label: "no-param-node",
            transientData: "Value without queryparam",
        },
        style: {
            background: '#fff3e0',
            border: '2px solid #ef6c00',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 170,
        },
    },
    {
        id: '5',
        type: 'END',
        position: { x: 484, y: 386 },
        data: {
            label: 'End',
        },
        style: {
            background: '#f3e5f5',
            border: '2px solid #7b1fa2',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 140,
        },
    }
];

const initialEdges: Edge[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        style: { strokeWidth: 2, stroke: '#ef6c00' }
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        style: { strokeWidth: 2, stroke: '#ef6c00' }
    },
    {
        id: 'e2-4',
        source: '2',
        target: '4',
        style: { strokeWidth: 2, stroke: '#ef6c00' },
    },
    {
        id: 'e3-5',
        source: '3',
        target: '5',
        style: { strokeWidth: 2, stroke: '#ef6c00' },
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        style: { strokeWidth: 2, stroke: '#ef6c00' },
    },
];


export default function FamilyTreeApp() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nextNodePosition, setNextNodePosition] = useState({ x: 200, y: 600 });
    const [notification, setNotification] = useState<string | null>(null);
    // Sidebars are always visible now
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editHtml, setEditHtml] = useState('');
    const [editConditions, setEditConditions] = useState<string[]>([]);
    const [editType, setEditType] = useState<string | null>(null);


    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Function to handle when a new node is saved
    const handleNodeSaved = useCallback((nodeData: { id: string, name: string }) => {
        const newNode: Node = {
            id: nodeData.id,
            type: 'default',
            position: { x: nextNodePosition.x, y: nextNodePosition.y },
            data: {
                label: nodeData.name,
            },
            style: {
                background: '#e1f7d5',
                border: '2px solid #4caf50',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '10px',
                width: 160,
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                animation: 'pulse 2s',
            },
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setNotification(`✨ Added "${nodeData.name}" to the family tree!`);
        setTimeout(() => setNotification(null), 3000);
        setNextNodePosition(prev => ({
            x: prev.x + 220,
            y: prev.x > 800 ? prev.y + 100 : prev.y,
        }));
        if (nextNodePosition.x > 800) {
            setNextNodePosition(prev => ({ x: 200, y: prev.y }));
        }
    }, [setNodes, nextNodePosition]);

    // Update the input node to include the callback
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

    const onNodesChangeFiltered = useCallback(
        (changes: any[]) => {
            const filtered = changes.filter((change: { type: string; id: string; }) => {
                if (change.type === 'remove') {
                    const node = nodes.find(n => n.id === change.id);
                    if (node && (node.type === 'START' || node.type === 'END')) {
                        return false;
                    }
                }
                return true;
            });
            onNodesChange(filtered);
        },
        [onNodesChange, nodes]
    );

    // Drag and drop handlers for React Flow
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        const position = reactFlowBounds
            ? {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            }
            : { x: 250, y: 250 };

        let newNode: Node;
        let nodeId = `dnd_${+new Date()}`;

        if (type === 'VIEW') {
            newNode = {
                id: nodeId,
                type: 'VIEW',
                position,
                data: { label: 'View Node', html: '' },
                style: {
                    background: '#e3f2fd',
                    border: '2px solid #1976d2',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '10px',
                    width: 160,
                },
            };
            setEditTitle('View Node');
            setEditHtml('');
            setEditType('VIEW');
        } else if (type === 'DECISION') {
            newNode = {
                id: nodeId,
                type: 'DECISION',
                position,
                data: { label: 'Decision Node', choices: [''] },
                style: {
                    background: '#fff3e0',
                    border: '2px solid #ff9800',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '10px',
                    width: 160,
                },
            };
            setEditTitle('Decision Node');
            setEditConditions(['']);
            setEditType('DECISION');
        } else {
            return;
        }

        setNodes((nds) => nds.concat(newNode));
        setSelectedNode(newNode);
        setEditModalOpen(true);
    }, [setNodes]);

    // Node selection handler
    const onNodeClick = useCallback((_event: any, node: SetStateAction<Node | null>) => {
        setSelectedNode(node);
        // right sidebar always visible, just set selected node
    }, []);



    // Delete node handler
    const handleDeleteNode = useCallback(() => {
        if (selectedNode) {
            setNodes((nds) => nds.filter(n => n.id !== selectedNode.id));
            setSelectedNode(null);
            // setRightSidebarCollapsed(true);
        }
    }, [selectedNode, setNodes]);

    const handleSave = useCallback(async () => {
        const updatedNode = nodes.map(item=> {
            const targetNode = edges.filter(edge => edge.source === item.id)?.[0]?.target;
            return {
                "id": item.id,
                "nodeName": item.data.label,
                "nextNode": targetNode,
                "type": item.type,
                "position": item.position,
                "data": item.data
            };
        });
        const response = await fetch('/api/family-tree/single-tree', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                nodes,
                edges,
                updatedNode
            }),
        });
        const result = await response.json();
        if (result.success) {
            setNotification('💾 Family tree saved successfully!');
        } else {
            setNotification('❌ Error saving family tree.');
        }
        setTimeout(() => setNotification(null), 3000);
    }, [nodes, edges]);

    // Edit node handler (open modal and prepopulate)

    const handleEditNode = useCallback(() => {
        if (selectedNode) {
            setEditTitle(selectedNode.data?.label || '');
            setEditModalOpen(true);
        }
    }, [selectedNode]);
    // Save edited node title
    const handleEditSave = useCallback(() => {
        console.log(selectedNode)
        if (selectedNode) {
            setNodes(nds =>
                nds.map(n => {
                    if (n.id !== selectedNode.id) return n;
                    if (editType === 'VIEW') {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, transientData: editHtml }
                        };
                    }
                    if (editType === 'DECISION') {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, choices: editConditions }
                        };
                    }
                    return { ...n, data: { ...n.data, label: editTitle } };
                })
            );
            setEditModalOpen(false);
        }
    }, [selectedNode, editTitle, editHtml, editConditions, editType, setNodes]);


    return (
        <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Sidebar />
            <RightSidebar
                selectedNode={selectedNode}
                onEdit={() => {
                    if (selectedNode) {
                        setEditTitle(selectedNode.data?.label || '');
                        setEditHtml(selectedNode.data?.transientData || '');
                        setEditConditions(selectedNode.data?.choices || ['']);
                        setEditType(selectedNode.type === 'DECISION' ? 'DECISION' : 'VIEW');
                        setEditModalOpen(true);
                    }
                }}
                onDelete={handleDeleteNode}
            />

            {/* Edit Modal */}
            <EditNodeModal
                open={editModalOpen}
                editType={editType}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editHtml={editHtml}
                setEditHtml={setEditHtml}
                editConditions={editConditions}
                setEditConditions={setEditConditions}
                onClose={() => setEditModalOpen(false)}
                onSave={handleEditSave}
            />

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 60,
                    zIndex: 5,
                    background: 'rgba(76, 175, 80, 0.95)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px',
                    fontWeight: '600',
                    animation: 'slideIn 0.3s ease-out',
                }}>
                    {notification}
                </div>
            )}

            <div
                ref={reactFlowWrapper}
                style={{ width: '100vw', height: '100vh', marginLeft: 180, marginRight: 240 }}
            >
                <ReactFlow
                    nodes={updatedNodes}
                    edges={edges}
                    onNodesChange={onNodesChangeFiltered}
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
            <BottomBar onSave={handleSave} />
        </div>
    );
}