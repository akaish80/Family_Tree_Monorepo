"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./appFlow.module.scss";
import BottomBar from "../../components/BottomBar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";
import EditNodeModal from "../../components/EditNodeModal";
import { FlowCanvas } from "./components/FlowCanvas";
import { Notification } from "./components/Notification";
import { useFlowState } from "./hooks/useFlowState";
import { useNodeHandlers } from "./hooks/useNodeHandlers";
import { useDragDrop } from "./hooks/useDragDrop";
import "./appFlow.module.scss"

export default function AppFlowPage() {
    const { configId } = useParams();
    const configIdString = Array.isArray(configId) ? configId[0] : configId || '';

    // Use the custom hook for all flow state management
    const flowState = useFlowState(configIdString);

    // Use the node handlers hook
    const nodeHandlers = useNodeHandlers({
        selectedNode: flowState.selectedNode,
        setNodes: flowState.setNodes,
        setEdges: flowState.setEdges,
        setSelectedNode: flowState.setSelectedNode,
        setEditTitle: flowState.setEditTitle,
        setEditHtml: flowState.setEditHtml,
        setEditType: flowState.setEditType,
        setEditConditions: flowState.setEditConditions,
        setEditModalOpen: flowState.setEditModalOpen,
    });

    // Use the drag and drop hook
    const dragDropHandlers = useDragDrop({
        setNodes: flowState.setNodes,
        setSelectedNode: flowState.setSelectedNode,
        setEditModalOpen: flowState.setEditModalOpen,
        setEditTitle: flowState.setEditTitle,
        setEditHtml: flowState.setEditHtml,
        setEditType: flowState.setEditType,
        setEditConditions: flowState.setEditConditions,
    });

    // Handle right sidebar edit action
    const handleRightSidebarEdit = () => {
        if (flowState.selectedNode) {
            flowState.setEditTitle(flowState.selectedNode.data?.label || '');
            flowState.setEditHtml(flowState.selectedNode.data?.transientData || '');
            flowState.setEditConditions(flowState.selectedNode.data?.choices || ['']);
            flowState.setEditType(flowState.selectedNode.type === 'DECISION' ? 'DECISION' : 'VIEW');
            flowState.setEditModalOpen(true);
        }
    };

    // Handle edit save with proper parameters
    const handleEditSave = () => {
        nodeHandlers.handleEditSave(
            flowState.editTitle,
            flowState.editHtml,
            flowState.editConditions,
            flowState.editType
        );
    };

    if (flowState.error) {
        return (
            <div className={styles.errorWrapper}>
                <h2>{flowState.error}</h2>
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
                selectedNode={flowState.selectedNode}
                onEdit={handleRightSidebarEdit}
                onDelete={nodeHandlers.handleDeleteNode}
            />

            <EditNodeModal
                open={flowState.editModalOpen}
                editType={flowState.editType}
                editTitle={flowState.editTitle}
                setEditTitle={flowState.setEditTitle}
                editHtml={flowState.editHtml}
                setEditHtml={flowState.setEditHtml}
                editConditions={flowState.editConditions}
                setEditConditions={flowState.setEditConditions}
                onClose={() => flowState.setEditModalOpen(false)}
                onSave={handleEditSave}
            />

            <Notification 
                message={flowState.notification}
                onClose={() => flowState.setNotification(null)}
            />

            <FlowCanvas
                nodes={flowState.nodes}
                edges={flowState.edges}
                onNodesChange={flowState.onNodesChangeFiltered}
                onEdgesChange={flowState.onEdgesChange}
                onConnect={flowState.onConnect}
                onNodeClick={nodeHandlers.onNodeClick}
                onDrop={dragDropHandlers.onDrop}
                onDragOver={dragDropHandlers.onDragOver}
                handleNodeSaved={flowState.handleNodeSaved}
            />
            
            <BottomBar 
                onSave={flowState.handleSave} 
                onPreview={flowState.handlePreview} 
            />
        </div>
    );
}