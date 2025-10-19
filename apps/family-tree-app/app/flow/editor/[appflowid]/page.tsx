"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    OnConnect,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./appFlow.module.scss";

import BottomBar from "../../../components/BottomBar";
import Sidebar from "../../../components/Sidebar";
import RightSidebar from "../../../components/RightSidebar";
import EditNodeModal from "../../../components/EditNodeModal";
import InputNode from "../../../components/InputNode";
import NonEditableNode from "../../../components/NonEditableNode";
import CanvasNode from "../../../components/CanvasNode";
import "./appFlow.module.scss";

interface AppFlowData {
    id: string;
    configId: string;
    flowName: string;
    description: string;
    nodes?: Node[];
    edges?: Edge[];
    createdAt: string;
    updatedAt: string;
}

const nodeTypes = {
    input: InputNode,
    START: NonEditableNode,
    END: NonEditableNode,
    CANVAS: CanvasNode
};

// Default nodes for empty flow
const defaultNodes: Node[] = [
    {
        id: "start",
        type: "START",
        position: { x: 250, y: 50 },
        data: { label: "START" },
        style: {
            background: '#e1f5fe',
            border: '2px solid #01579b',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 180,
        },
        deletable: false,
        connectable: true,
        sourcePosition: Position.Bottom,
    },
    {
        id: "end",
        type: "END",
        position: { x: 250, y: 400 },
        data: { label: "END" },
        style: {
            background: '#ffebee',
            border: '2px solid #d32f2f',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 180,
        },
        deletable: false,
        connectable: true,
        targetPosition: Position.Top,
    },
];

export default function AppFlowPage() {
    const params = useParams();
    const configId = new URLSearchParams(window.location.search).get("configId") as string;
    const flowId = params?.appflowid as string;
    
    const [appFlowData, setAppFlowData] = useState<AppFlowData | null>(null);
    const [configData, setConfigData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [notification, setNotification] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editHtml, setEditHtml] = useState("");
    const [editType, setEditType] = useState<string | null>(null);
    const [editConditions, setEditConditions] = useState<{ nextNodeLabel: string; expression: string }[]>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nextNodePosition, setNextNodePosition] = useState({ x: 200, y: 600 });

    // Fetch app flow data and configuration
    useEffect(() => {
        const fetchAppFlowData = async () => {
            if (!flowId) {
                setError("Configuration ID and Flow ID are required.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // // Fetch configuration data
                // const configResponse = await fetch(`/api/family-tree/configurations/${configId}`);
                // if (configResponse.ok) {
                //     const config = await configResponse.json();
                //     setConfigData(config);
                // } else {
                //     console.warn('Configuration not found, but continuing with flow data');
                // }

                // Fetch app flow data
                const flowResponse = await fetch(`/api/family-tree/flows?id=${flowId}`);
                if (flowResponse.ok) {
                    const flowsData = await flowResponse.json();
                    const currentFlow = flowsData.flows?.find((flow: any) => flow.id === flowId);
                    
                    if (currentFlow) {
                        setAppFlowData(currentFlow);
                        
                        // Load existing nodes and edges if they exist
                        if (currentFlow.nodes && currentFlow.nodes.length > 0) {
                            setNodes(currentFlow.nodes);
                        } else {
                            // Use default start and end nodes
                            setNodes(defaultNodes);
                        }
                        
                        if (currentFlow.edges && currentFlow.edges.length > 0) {
                            setEdges(currentFlow.edges);
                        }
                        
                        setError(null);
                    } else {
                        // Flow doesn't exist yet, create with default nodes
                        console.log('Flow not found, starting with default nodes');
                        setAppFlowData({
                            id: flowId,
                            configId: configId,
                            flowName: 'New App Flow',
                            description: '',
                            nodes: defaultNodes,
                            edges: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                        setNodes(defaultNodes);
                        setEdges([]);
                    }
                } else {
                    // API error, still show default nodes
                    console.log('Error fetching flows, starting with default nodes');
                    setAppFlowData({
                        id: flowId,
                        configId: configId,
                        flowName: 'New App Flow',
                        description: '',
                        nodes: defaultNodes,
                        edges: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    setNodes(defaultNodes);
                    setEdges([]);
                }
            } catch (err) {
                console.error('Error fetching app flow data:', err);
                setError("Unable to fetch app flow data. Please try again.");
                // Still show default nodes even on error
                setNodes(defaultNodes);
                setEdges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppFlowData();
    }, [configId, flowId, setNodes, setEdges]);


    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Function to validate connections - allow all connections except START as target
    const isValidConnection = useCallback((connection: any) => {
        // Don't allow connections to START node
        if (connection.target === "start") {
            return false;
        }
        // Allow all other connections, including to END node
        return true;
    }, []);
    
    // Drag and drop handlers for React Flow
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    
    // Drop handler
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const position = reactFlowBounds
                ? {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                }
                : { x: 250, y: 250 };

            let newNode: Node;
            let nodeId = `node_${+new Date()}`;

            if (type === "VIEW") {
                newNode = {
                    id: nodeId,
                    type: "VIEW",
                    position,
                    data: { label: "View Node", transientData: "" },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                setEditTitle("View Node");
                setEditHtml("");
                setEditType("VIEW");
            } else if (type === "DECISION") {
                newNode = {
                    id: nodeId,
                    type: "DECISION",
                    position,
                    data: { label: "Decision Node", choices: [{ nextNodeLabel: "", expression: "" }] },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                setEditTitle("Decision Node");
                setEditConditions([{ nextNodeLabel: "", expression: "" }]);
                setEditType("DECISION");
            } else if (type === "CANVAS") {
                // Get canvas data from drag event
                const canvasId = event.dataTransfer.getData("canvas-id");
                const canvasName = event.dataTransfer.getData("canvas-name");
                const canvasConfigId = event.dataTransfer.getData("canvas-config-id");
                const canvasFlowId = event.dataTransfer.getData("canvas-flow-id");

                newNode = {
                    id: nodeId,
                    type: "CANVAS",
                    position,
                    data: { 
                        label: canvasName || "Canvas Node",
                        canvasId: canvasId,
                        canvasName: canvasName,
                        configId: canvasConfigId,
                        flowId: canvasFlowId,
                    },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                
                // Canvas nodes don't need editing modal, just add them directly
                setNodes(nds => nds.concat(newNode));
                setSelectedNode(newNode);
                return; // Early return to skip modal opening
            } else {
                return;
            }

            setNodes(nds => nds.concat(newNode));
            setSelectedNode(newNode);
            setEditModalOpen(true);
        },
        [setNodes]
    );

    // Node click handler
    const onNodeClick = (_: any, node: Node) => {
        setSelectedNode(node);
    };

    // Edit node handler
    const handleEditNode = useCallback(() => {
        if (selectedNode) {
            setEditTitle(selectedNode?.data?.label || "");
            setEditHtml(selectedNode?.data?.transientData || "");
            setEditType(selectedNode?.type ?? null);
            setEditConditions(
                selectedNode?.data?.choices?.map((c: any) => ({
                    nextNodeLabel: c.nextNodeLabel || "",
                    expression: c.expression || "",
                })) || [{ nextNodeLabel: "", expression: "" }]
            );
            setEditModalOpen(true);
        }
    }, [selectedNode]);

    // Save edited node
    const handleEditSave = useCallback(() => {
        if (selectedNode) {
            setNodes(nds =>
                nds.map(n => {
                    if (n.id !== selectedNode.id) return n;
                    if (editType === "VIEW") {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, transientData: editHtml },
                        };
                    }
                    if (editType === "DECISION") {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, choices: editConditions },
                        };
                    }
                    return { ...n, data: { ...n.data, label: editTitle } };
                })
            );
            setEditModalOpen(false);
        }
    }, [selectedNode, editTitle, editHtml, editConditions, editType, setNodes]);

    // Delete node
    const handleDeleteNode = useCallback(() => {
        if (selectedNode && selectedNode.type !== "START" && selectedNode.type !== "END") {
            setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
            setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNode(null);
        }
    }, [selectedNode, setNodes, setEdges]);


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

    const handlePreview = () => {
        window.open(`http://localhost:3001/${configId}/${flowId}`, '_blank');
    };

    // Save app flow
    const handleSave = async () => {
        try {
            let startNode = '';
            const updatedNode = nodes.map(item => {
                if (item.type === 'START') startNode = item.id;
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

            const saveData = {
                configId,
                flowId,
                flowName: appFlowData?.flowName || 'App Flow',
                description: appFlowData?.description || '',
                startNode,
                nodes,
                edges,
                updatedNode,
                updatedAt: new Date().toISOString()
            };

            const response = await fetch(`/api/family-tree/flows/editor/${flowId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                setNotification('✨ App flow saved successfully!');
                setTimeout(() => setNotification(null), 3000);
            } else {
                throw new Error('Failed to save app flow');
            }
        } catch (error) {
            console.error('Error saving app flow:', error);
            setNotification('❌ Failed to save app flow');
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // Cancel changes (reload from server)
    const handleCancel = async () => {
        try {
            const response = await fetch(`/api/family-tree/flows?configId=${configId}`);
            if (response.ok) {
                const flowsData = await response.json();
                const currentFlow = flowsData.flows?.find((flow: any) => flow.id === flowId);
                
                if (currentFlow) {
                    setNodes(currentFlow.nodes || defaultNodes);
                    setEdges(currentFlow.edges || []);
                    setAppFlowData(currentFlow);
                } else {
                    // Reset to default nodes if flow doesn't exist
                    setNodes(defaultNodes);
                    setEdges([]);
                }
            } else {
                // Reset to default nodes if API fails
                setNodes(defaultNodes);
                setEdges([]);
            }
            setNotification('Changes cancelled');
            setTimeout(() => setNotification(null), 2000);
        } catch (error) {
            console.error('Error cancelling changes:', error);
            setNodes(defaultNodes);
            setEdges([]);
        }
    };


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

    // Modal component
    // const EditNodeModal = () =>
    //     editModalOpen && (
    //         <div className={styles.modalOverlay}>
    //             <div className={styles.modal}>
    //                 <h3 className={styles.modalTitle}>
    //                     Edit {editType === "VIEW" ? "View Node" : "Decision Node"}
    //                 </h3>
    //                 <label className={styles.modalLabel}>
    //                     Title:
    //                     <input
    //                         type="text"
    //                         value={editTitle}
    //                         onChange={e => setEditTitle(e.target.value)}
    //                         className={styles.modalInput}
    //                     />
    //                 </label>
    //                 {editType === "VIEW" && (
    //                     <label className={styles.modalLabel}>
    //                         HTML Content:
    //                         <textarea
    //                             value={editHtml}
    //                             onChange={e => setEditHtml(e.target.value)}
    //                             rows={4}
    //                             className={styles.modalTextarea}
    //                         />
    //                     </label>
    //                 )}
    //                 {editType === "DECISION" && (
    //                     <div>
    //                         <label className={styles.modalLabel}>Conditions:</label>
    //                         {editConditions.map((cond, idx) => (
    //                             <div key={idx} className={styles.conditionRow}>
    //                                 <input
    //                                     type="text"
    //                                     value={cond.nextNodeLabel}
    //                                     onChange={e => {
    //                                         const updated = [...editConditions];
    //                                         updated[idx] = { ...updated[idx], nextNodeLabel: e.target.value };
    //                                         setEditConditions(updated);
    //                                     }}
    //                                     className={styles.modalInput}
    //                                     placeholder="Target Node Name"
    //                                 />
    //                                 <input
    //                                     type="text"
    //                                     value={cond.expression}
    //                                     onChange={e => {
    //                                         const updated = [...editConditions];
    //                                         updated[idx] = { ...updated[idx], expression: e.target.value };
    //                                         setEditConditions(updated);
    //                                     }}
    //                                     className={styles.modalInput}
    //                                     placeholder="Condition/Expression"
    //                                 />
    //                                 <button
    //                                     onClick={() => setEditConditions(editConditions.filter((_, i) => i !== idx))}
    //                                     className={styles.deleteCondBtn}
    //                                     disabled={editConditions.length === 1}
    //                                     title="Remove condition"
    //                                 >
    //                                     🗑️
    //                                 </button>
    //                             </div>
    //                         ))}
    //                         <button
    //                             onClick={() => setEditConditions([...editConditions, { nextNodeLabel: "", expression: "" }])}
    //                             className={styles.addCondBtn}
    //                         >
    //                             + Add Condition
    //                         </button>
    //                     </div>
    //                 )}
    //                 <div className={styles.modalActions}>
    //                     <button onClick={() => setEditModalOpen(false)} className={styles.cancelBtn}>
    //                         Cancel
    //                     </button>
    //                     <button
    //                         onClick={handleEditSave}
    //                         className={styles.saveBtn}
    //                         disabled={!editTitle.trim()}
    //                     >
    //                         Save
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );

    if (error) {
        return (
            <div className={styles.errorWrapper}>
                <h2>{error}</h2>
                <Link href="/configurations" className={styles.backLink}>
                    ← Back to Configurations
                </Link>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>

            <Link href="/configurations" className={styles.backLink}>
                ← Back to Configurations
            </Link>
            
            <Sidebar configId={configId} flowId={flowId} />
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
                style={{ width: '100vw', height: '100vh', marginLeft: 180, marginRight: 240, paddingTop: 80 }}
            >
                <ReactFlow
                    nodes={updatedNodes}
                    edges={edges}
                    onNodesChange={onNodesChangeFiltered}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
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
            <BottomBar onSave={handleSave} onReset={handleCancel} onPreview={handlePreview} />
        </div>
    );
}