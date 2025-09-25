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
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./appFlow.module.scss";
import BottomBar from "../../components/BottomBar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";
import EditNodeModal from "../../components/EditNodeModal";
import InputNode from "../../components/InputNode";
import NonEditableNode from "../../components/NonEditableNode";
import "./appFlow.module.scss"


const nodeTypes = {
    input: InputNode,
    START: NonEditableNode,
    END: NonEditableNode
};

export default function AppFlowPage() {
    const { configId } = useParams();
    const [configData, setConfigData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [notification, setNotification] = useState<string | null>(null);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editHtml, setEditHtml] = useState("");
    const [editType, setEditType] = useState<string | null>(null);
    const [editConditions, setEditConditions] = useState<{ nextNodeLabel: string; expression: string }[]>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nextNodePosition, setNextNodePosition] = useState({ x: 200, y: 600 });

    // Fetch configuration data
    useEffect(() => {
        axios
            .get(`/api/family-tree?configId=${configId}`)
            .then(res => {
                if (res.data && res.data.success === false && res.data.message === "Configuration not found") {
                    setError("Configuration not found.");
                    setConfigData(null);
                } else {
                    setConfigData(res.data);
                    setError(null);
                    // Initialize nodes and edges
                    setNodes(res.data.nodes || []);
                    setEdges(res.data.edges || []);
                }
            })
            .catch(() => {
                setError("Unable to fetch configuration. Please try again.");
                setConfigData(null);
            });
    }, [configId, setNodes, setEdges]);


    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    
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

            if (type === "view") {
                newNode = {
                    id: nodeId,
                    type: "VIEW",
                    position,
                    data: { label: "View Node", transientData: "" },
                };
                setEditTitle("View Node");
                setEditHtml("");
                setEditType("view");
            } else if (type === "DECISION") {
                newNode = {
                    id: nodeId,
                    type: "DECISION",
                    position,
                    data: { label: "Decision Node", choices: [{ nextNodeLabel: "", expression: "" }] },
                };
                setEditTitle("Decision Node");
                setEditConditions([{ nextNodeLabel: "", expression: "" }]);
                setEditType("DECISION");
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
        window.open(`https://localhost:3001/html-viewer?configId=${configId}`, '_blank');
    };

    // Save app flow
    const handleSave = async () => {
        let startNode = ''
        const updatedNode = nodes.map(item=> {
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
        await axios.post(`/api/family-tree?configId=${configId}`, {
            action: "save",
            startNode,
            nodes,
            edges,
            updatedNode
        });
        // Optionally show a notification
    };

    // Cancel changes (reload from server)
    const handleCancel = async () => {
        const res = await axios.get(`/api/family-tree?configId=${configId}`);
        setNodes(res.data.nodes || []);
        setEdges(res.data.edges || []);
    };

    // Initial default nodes if empty
    useEffect(() => {
        if (nodes.length === 0 && !error) {
            setNodes([
                {
                    id: "start",
                    type: "START",
                    position: { x: 100, y: 50 },
                    data: { label: "START" },
                },
                {
                    id: "end",
                    type: "END",
                    position: { x: 500, y: 350 },
                    data: { label: "End" },
                },
            ]);
        }
    }, [nodes, error, setNodes]);


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
            <BottomBar onSave={handleSave} onPreview={handlePreview}  />
        </div>
    );
}