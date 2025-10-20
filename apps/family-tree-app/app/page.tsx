"use client";

import React, { useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import BottomBar from './components/BottomBar';
import EditNodeModal from './components/EditNodeModal';
import FlowEditorCanvas from './components/FlowEditorCanvas';
import NotificationToast from './components/NotificationToast';

// Custom hooks
import { useFlowEditorState } from './flow/editor/[appflowid]/hooks/useFlowEditorState';

export default function FamilyTreeApp() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    
    // Use custom hooks for state management and operations
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        selectedNode,
        setSelectedNode,
        notification,
        setNotification,
        editModalOpen,
        setEditModalOpen,
        editTitle,
        setEditTitle,
        editHtml,
        setEditHtml,
        editConditions,
        setEditConditions,
        editType,
        setEditType,
        handleSave,
        handleNodeSaved
    } = useFlowEditorState("default", "main");

    // Update nodes to include the node saved callback
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

    // Node operations using useCallback
    const onNodeClick = useCallback((_event: any, node: any) => {
        setSelectedNode(node);
    }, [setSelectedNode]);

    const handleDeleteNode = useCallback(() => {
        if (selectedNode) {
            const updatedNodes = nodes.filter(n => n.id !== selectedNode.id);
            // Use the onNodesChange from the state hook to update
            setSelectedNode(null);
        }
    }, [selectedNode, nodes, setSelectedNode]);

    const handleEditSave = useCallback(() => {
        if (selectedNode) {
            setEditModalOpen(false);
        }
    }, [selectedNode, setEditModalOpen]);

    // Drag and drop handlers 
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

        let newNode: any;
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
                data: { label: 'Decision Node', choices: [{ nextNodeLabel: "", expression: "" }] },
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
            setEditConditions([{ nextNodeLabel: "", expression: "" }]);
            setEditType('DECISION');
        } else {
            return;
        }

        // Add the new node
        const updatedNodes = [...nodes, newNode];
        setSelectedNode(newNode);
        setEditModalOpen(true);
    }, [nodes, reactFlowWrapper, setEditTitle, setEditHtml, setEditType, setEditConditions, setSelectedNode, setEditModalOpen]);


    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        }}>
            <Sidebar />
            
            <RightSidebar
                selectedNode={selectedNode}
                onEdit={() => {
                    if (selectedNode) {
                        setEditTitle(selectedNode.data?.label || '');
                        setEditHtml(selectedNode.data?.transientData || '');
                        setEditConditions(selectedNode.data?.choices || [{ nextNodeLabel: "", expression: "" }]);
                        setEditType(selectedNode.type === 'DECISION' ? 'DECISION' : 'VIEW');
                        setEditModalOpen(true);
                    }
                }}
                onDelete={handleDeleteNode}
            />

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

            {notification && (
                <NotificationToast
                    message={notification}
                    type="success"
                    onClose={() => setNotification(null)}
                />
            )}

            <FlowEditorCanvas
                ref={reactFlowWrapper}
                nodes={updatedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
            />
            
            <BottomBar onSave={handleSave} />
        </div>
    );
}