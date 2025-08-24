"use client";

import { Button } from '@repo/ui/button';
import { useCallback, useState } from 'react';
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

// Custom Input Node Component
const InputNode = ({ data, id }: { data: any, id: string }) => {
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [savedName, setSavedName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        if (inputValue.trim()) {
            setIsSaving(true);
            setSaveStatus('idle');

            try {
                const response = await fetch('/api/family-tree', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'add',
                        node: {
                            id: `dynamic-${Date.now()}`, // Generate unique ID
                            name: inputValue.trim()
                        }
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setSavedName(inputValue.trim());
                    setIsEditing(false);
                    setSaveStatus('success');

                    // Call parent component to add this node to React Flow
                    if (data.onNodeSaved) {
                        data.onNodeSaved({
                            id: `dynamic-${Date.now()}`,
                            name: inputValue.trim()
                        });
                    }

                    // Reset input for next use
                    setTimeout(() => {
                        setInputValue('');
                        setIsEditing(true);
                        setSavedName('');
                        setSaveStatus('idle');
                    }, 2000);

                } else {
                    setSaveStatus('error');
                }
            } catch (error) {
                console.error('Error saving node:', error);
                setSaveStatus('error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleEdit = () => {
        setInputValue(savedName);
        setIsEditing(true);
    };

    return (
        <div style={{
            padding: '12px',
            background: '#fff8e1',
            border: '2px solid #ff9800',
            borderRadius: '12px',
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
            <div style={{
                fontSize: '12px',
                color: '#e65100',
                fontWeight: 'bold',
                marginBottom: '8px',
                textAlign: 'center',
            }}>
                ➕ Add New Member
            </div>

            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter name..."
                        disabled={isSaving}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ffb74d',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px',
                            outline: 'none',
                            opacity: isSaving ? 0.7 : 1,
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isSaving) {
                                handleSave();
                            }
                        }}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!inputValue.trim() || isSaving}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: isSaving ? '#ffa726' : (inputValue.trim() ? '#ff9800' : '#ccc'),
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: (!inputValue.trim() || isSaving) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSaving ? '⏳ Saving...' : '💾 Save'}
                    </button>

                    {saveStatus === 'error' && (
                        <div style={{
                            marginTop: '8px',
                            padding: '6px',
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textAlign: 'center',
                        }}>
                            ❌ Failed to save. Try again.
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {saveStatus === 'success' ? (
                        <div style={{
                            padding: '12px',
                            background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            textAlign: 'center',
                            border: '2px solid #4caf50',
                        }}>
                            <div style={{
                                fontSize: '20px',
                                marginBottom: '4px',
                            }}>
                                ✅
                            </div>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                fontSize: '14px',
                                marginBottom: '4px',
                            }}>
                                {savedName}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#4caf50',
                            }}>
                                Added successfully!
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '8px',
                            background: '#f3e5f5',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#4a148c',
                        }}>
                            {savedName}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
const NonEditableNode = ({ data }: { data: any }) => (
    <div style={{
        padding: '12px',
        background: '#e1f5fe',
        border: '2px solid #01579b',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '120px',
        color: '#01579b',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        userSelect: 'none',
        // pointerEvents: 'none', // <-- DO NOT set this!
    }}>
        {data.label === 'START' && (
            <Handle type="source" position={Position.Bottom} id="a" style={{ background: '#01579b' }} />
        )}
        {data.label === 'End' && (
            <Handle type="target" position={Position.Top} id="b" style={{ background: '#7b1fa2' }} />
        )}
        {data.label}
    </div>
);

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
        position: { x: 200, y: 200 },
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
        type: 'default',
        position: { x: 600, y: 200 },
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
        type: 'default',
        position: { x: 300, y: 350 },
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
        position: { x: 500, y: 350 },
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
        style: { strokeWidth: 2, stroke: '#ef6c00' },
        animated: true,
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        style: { strokeWidth: 2, stroke: '#ef6c00' },
        animated: true,
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

        // Add the new node to the canvas
        setNodes((prevNodes) => [...prevNodes, newNode]);

        // Show notification
        setNotification(`✨ Added "${nodeData.name}" to the family tree!`);
        setTimeout(() => setNotification(null), 3000);

        // Update position for next node (stagger them)
        setNextNodePosition(prev => ({
            x: prev.x + 220, // Move to the right
            y: prev.x > 800 ? prev.y + 100 : prev.y, // Move down if too far right
        }));

        // Reset x position if we've gone too far right
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
        (changes) => {
            // Filter out remove actions for START and END nodes
            const filtered = changes.filter(change => {
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

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '15px 25px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    🌳 Family Tree Visualization
                </h1>
                <p style={{
                    margin: '5px 0 0 0',
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500',
                }}>
                    Interactive family tree with React Flow
                </p>
            </div>

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
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

            <ReactFlow
                nodes={updatedNodes}
                edges={edges}
                onNodesChange={onNodesChangeFiltered}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={{
                    background: 'transparent',
                }}
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
            <button>Save</button>
        </div>
    );
}